import { BrowserWindow, app } from 'electron';
import * as http from 'http';
import { DEV_SERVER_URL, PRELOAD_SCRIPT_PATH, PROD_STATIC_PATH, isDev } from '../config/env';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  public createWindow(): BrowserWindow {
    this.mainWindow = new BrowserWindow({
      width: 1280,
      height: 830,
      minWidth: 900,
      minHeight: 600,
      title: 'Enterprise AI Web Platform',
      backgroundColor: '#030712', // Deep dark theme background matching Next.js globals
      show: false, // Don't show until ready-to-show to prevent visual flash
      webPreferences: {
        preload: PRELOAD_SCRIPT_PATH,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webSecurity: true,
      },
    });

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    this.loadFrontend();

    return this.mainWindow;
  }

  private loadFrontend(): void {
    if (!this.mainWindow) return;

    if (isDev) {
      this.pollDevServerAndLoad(DEV_SERVER_URL);
    } else {
      this.mainWindow.loadFile(PROD_STATIC_PATH).catch((err) => {
        console.error('Failed to load static production Next.js build:', err);
        // Fallback to dev server if static build is missing
        this.mainWindow?.loadURL(DEV_SERVER_URL);
      });
    }
  }

  private pollDevServerAndLoad(url: string, retryDelay = 1000): void {
    const checkServer = () => {
      http
        .get(url, (res) => {
          if (res.statusCode === 200 || res.statusCode === 304 || res.statusCode === 302 || res.statusCode === 307) {
            console.log(`[Electron WindowManager] Next.js dev server ready at ${url}`);
            this.mainWindow?.loadURL(url);
          } else {
            setTimeout(checkServer, retryDelay);
          }
        })
        .on('error', () => {
          console.log(`[Electron WindowManager] Waiting for Next.js dev server at ${url}...`);
          setTimeout(checkServer, retryDelay);
        });
    };

    checkServer();
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
}
