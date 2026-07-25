import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

export interface ApiErrorResponse {
  message: string;
  code?: string;
  detail?: string | Record<string, any>;
  status?: number;
}

export class ApiError extends Error {
  public status: number;
  public data: any;
  public originalError: AxiosError;

  constructor(message: string, status: number, data?: any, originalError?: AxiosError) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.originalError = originalError as AxiosError;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const ACCESS_TOKEN_KEY = 'ai_ide_access_token';
const REFRESH_TOKEN_KEY = 'ai_ide_refresh_token';

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens: (): boolean => {
    return !!tokenStorage.getAccessToken();
  },
};

interface FailedRequestQueueItem {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

export class HttpClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: FailedRequestQueueItem[] = [];

  constructor(baseURL?: string) {
    this.instance = axios.create({
      baseURL: baseURL || (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:8000/api/v1',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private processQueue(error: any, token: string | null = null): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = tokenStorage.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!error.response) {
          return Promise.reject(
            new ApiError(
              'Network connection error. Please check your connection.',
              0,
              null,
              error
            )
          );
        }

        const { status } = error.response;

        if (status === 401 && originalRequest && !originalRequest._retry) {
          if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
            return Promise.reject(this.normalizeError(error));
          }

          if (this.isRefreshing) {
            return new Promise<string>((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.instance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          const refreshToken = tokenStorage.getRefreshToken();

          if (!refreshToken) {
            this.isRefreshing = false;
            tokenStorage.clearTokens();
            this.redirectToLogin();
            return Promise.reject(this.normalizeError(error));
          }

          try {
            const refreshResponse = await axios.post<{
              access_token: string;
              refresh_token: string;
              expires_in: number;
            }>(
              `${this.instance.defaults.baseURL}/auth/refresh`,
              { refresh_token: refreshToken },
              { headers: { 'Content-Type': 'application/json' } }
            );

            const { access_token: newAccessToken, refresh_token: newRefreshToken } = refreshResponse.data;
            tokenStorage.setTokens(newAccessToken, newRefreshToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            this.processQueue(null, newAccessToken);
            this.isRefreshing = false;

            return this.instance(originalRequest);
          } catch (refreshErr: any) {
            this.processQueue(refreshErr, null);
            this.isRefreshing = false;
            tokenStorage.clearTokens();
            this.redirectToLogin();
            return Promise.reject(
              new ApiError('Session expired. Please log in again.', 401, refreshErr, error)
            );
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private normalizeError(error: AxiosError): ApiError {
    const status = error.response?.status || 500;
    const responseData = error.response?.data as ApiErrorResponse | any;
    
    let message = 'An unexpected error occurred.';
    if (responseData?.detail) {
      message = typeof responseData.detail === 'string' ? responseData.detail : JSON.stringify(responseData.detail);
    } else if (responseData?.message) {
      message = responseData.message;
    } else if (error.message) {
      message = error.message;
    }

    return new ApiError(message, status, responseData, error);
  }

  private redirectToLogin(): void {
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export const httpClient = new HttpClient();
