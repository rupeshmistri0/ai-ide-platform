import { getEnv, isDev, isProd, isTest, isBrowser, isServer } from './env';

export interface AppConfig {
  env: 'development' | 'production' | 'test';
  isDev: boolean;
  isProd: boolean;
  isTest: boolean;
  isBrowser: boolean;
  isServer: boolean;
  app: {
    name: string;
  };
  api: {
    baseUrl: string;
    wsUrl: string;
    timeoutMs: number;
  };
  desktop: {
    devServerUrl: string;
    windowWidth: number;
    windowHeight: number;
  };
  auth: {
    accessTokenKey: string;
    refreshTokenKey: string;
    tokenExpireMinutes: number;
  };
  ai: {
    defaultModel: string;
    temperature: number;
  };
}

export const createConfig = (): AppConfig => {
  const envStr = getEnv('NODE_ENV', 'development');
  const env = (envStr === 'production' ? 'production' : envStr === 'test' ? 'test' : 'development') as 'development' | 'production' | 'test';

  return {
    env,
    isDev: env === 'development',
    isProd: env === 'production',
    isTest: env === 'test',
    isBrowser,
    isServer,
    app: {
      name: getEnv('NEXT_PUBLIC_APP_NAME', 'Enterprise AI IDE Platform'),
    },
    api: {
      baseUrl: getEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8000/api/v1'),
      wsUrl: getEnv('NEXT_PUBLIC_WS_URL', 'ws://localhost:8000/api/v1/ws'),
      timeoutMs: 15000,
    },
    desktop: {
      devServerUrl: getEnv('DESKTOP_DEV_SERVER_URL', 'http://localhost:3000'),
      windowWidth: parseInt(getEnv('DESKTOP_WINDOW_WIDTH', '1380'), 10),
      windowHeight: parseInt(getEnv('DESKTOP_WINDOW_HEIGHT', '900'), 10),
    },
    auth: {
      accessTokenKey: 'ai_ide_access_token',
      refreshTokenKey: 'ai_ide_refresh_token',
      tokenExpireMinutes: 60,
    },
    ai: {
      defaultModel: getEnv('DEFAULT_AI_MODEL', 'gemini-1.5-pro'),
      temperature: parseFloat(getEnv('DEFAULT_AI_TEMPERATURE', '0.7')),
    },
  };
};

export const appConfig = createConfig();
