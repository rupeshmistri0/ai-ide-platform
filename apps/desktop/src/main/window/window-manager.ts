import { BrowserWindow, Menu } from 'electron';
import * as http from 'http';
import { DEV_SERVER_URL, PRELOAD_SCRIPT_PATH, PROD_STATIC_PATH, isDev } from '../config/env';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  public createWindow(): BrowserWindow {
    // Hide default native Electron menu bar for modern app aesthetic
    Menu.setApplicationMenu(null);

    this.mainWindow = new BrowserWindow({
      width: 1380,
      height: 900,
      minWidth: 1000,
      minHeight: 650,
      title: 'Enterprise AI Web Platform',
      backgroundColor: '#030712', // Match dark theme background
      autoHideMenuBar: true,
      show: true, // Ensure window is immediately visible when launched
      webPreferences: {
        preload: PRELOAD_SCRIPT_PATH,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
      },
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
        this.mainWindow?.loadURL(DEV_SERVER_URL);
      });
    }
  }

  private pollDevServerAndLoad(url: string, retryDelay = 800): void {
    let loaded = false;

    // Immediately trigger initial load so renderer starts connecting
    this.mainWindow?.loadURL(url).catch(() => {
      // Ignore initial connection error while Next server boots
    });

    const checkServer = () => {
      if (loaded) return;

      http
        .get(url, (res) => {
          if (
            res.statusCode &&
            res.statusCode >= 200 &&
            res.statusCode < 400 &&
            !loaded
          ) {
            loaded = true;
            console.log(`[Electron WindowManager] Next.js dev server ready at ${url}`);
            this.mainWindow?.loadURL(url).catch(() => {});
            this.mainWindow?.show();
            this.mainWindow?.focus();
          } else if (!loaded) {
            setTimeout(checkServer, retryDelay);
          }
        })
        .on('error', () => {
          if (!loaded) {
            setTimeout(checkServer, retryDelay);
          }
        });
    };

    checkServer();
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
}
