import * as path from 'path';

export const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
export const isProd = process.env.NODE_ENV === 'production';

export const DEV_SERVER_URL = process.env.DESKTOP_DEV_SERVER_URL || process.env.DEV_SERVER_URL || 'http://localhost:3000';
export const PROD_STATIC_PATH = path.join(__dirname, '../../../web/out/index.html');
export const PRELOAD_SCRIPT_PATH = path.join(__dirname, '../preload/index.js');

export const WINDOW_CONFIG = {
  width: parseInt(process.env.DESKTOP_WINDOW_WIDTH || '1380', 10),
  height: parseInt(process.env.DESKTOP_WINDOW_HEIGHT || '900', 10),
  minWidth: 1000,
  minHeight: 650,
};
