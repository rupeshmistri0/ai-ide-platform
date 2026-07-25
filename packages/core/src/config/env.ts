export const getEnv = (key: string, defaultValue = ''): string => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

export const isDev = getEnv('NODE_ENV', 'development') === 'development';
export const isProd = getEnv('NODE_ENV') === 'production';
export const isTest = getEnv('NODE_ENV') === 'test';
export const isBrowser = typeof window !== 'undefined';
export const isServer = !isBrowser;
