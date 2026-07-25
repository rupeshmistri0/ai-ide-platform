import { ipcMain, Notification, dialog, BrowserWindow } from 'electron';
import { IPCChannels } from '../../shared/channels';
import { FileDialogOptions, NotificationPayload } from '../../shared/types';

export function registerDialogHandlers() {
  ipcMain.handle(IPCChannels.DIALOG_NOTIFY, (_, payload: NotificationPayload): boolean => {
    if (!Notification.isSupported()) return false;
    const notification = new Notification({
      title: payload.title,
      body: payload.body,
    });
    notification.show();
    return true;
  });

  ipcMain.handle(
    IPCChannels.DIALOG_OPEN_FILE,
    async (event, options?: FileDialogOptions): Promise<string[] | null> => {
      const win = BrowserWindow.fromWebContents(event.sender);
      if (!win) return null;

      const result = await dialog.showOpenDialog(win, {
        title: options?.title || 'Select File',
        properties: ['openFile', 'multiSelections'],
        filters: options?.filters || [{ name: 'All Files', extensions: ['*'] }],
      });

      if (result.canceled) return null;
      return result.filePaths;
    }
  );
}
