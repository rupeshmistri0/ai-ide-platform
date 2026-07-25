import { app, BrowserWindow } from 'electron';
import { WindowManager } from './window/window-manager';
import { registerAppHandlers } from './handlers/app-handler';
import { registerWindowHandlers } from './handlers/window-handler';
import { registerDialogHandlers } from './handlers/dialog-handler';
import { isDev } from './config/env';

// Setup auto-reload in dev mode if electron-reloader is available
if (isDev) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('electron-reloader')(module, {
      debug: false,
      watchRenderer: false,
    });
  } catch (err) {
    console.log('[Electron Main] electron-reloader skipped or not installed.');
  }
}

const windowManager = new WindowManager();

function bootstrap() {
  // Register modular IPC event handlers
  registerAppHandlers();
  registerWindowHandlers();
  registerDialogHandlers();

  // Create main application window
  windowManager.createWindow();
}

app.whenReady().then(() => {
  bootstrap();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
