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
      show: false, // Show when ready to avoid unstyled flash
      webPreferences: {
        preload: PRELOAD_SCRIPT_PATH,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
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
        this.mainWindow?.loadURL(DEV_SERVER_URL);
      });
    }
  }

  private pollDevServerAndLoad(url: string, retryDelay = 1000): void {
    let loaded = false;

    const checkServer = () => {
      if (loaded) return;

      http
        .get(url, (res) => {
          if ((res.statusCode === 200 || res.statusCode === 304 || res.statusCode === 302 || res.statusCode === 307) && !loaded) {
            loaded = true;
            console.log(`[Electron WindowManager] Next.js dev server ready at ${url}`);
            
            // Give Next.js dev server a brief moment to compile CSS on first load
            setTimeout(() => {
              this.mainWindow?.loadURL(url).catch((err) => {
                console.error('[Electron WindowManager] Error loading URL:', err);
              });
            }, 500);
          } else if (!loaded) {
            setTimeout(checkServer, retryDelay);
          }
        })
        .on('error', () => {
          if (!loaded) {
            console.log(`[Electron WindowManager] Waiting for Next.js dev server at ${url}...`);
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
