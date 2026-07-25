import { contextBridge, ipcRenderer } from 'electron';
import { IPCChannels } from '../shared/channels';
import { ElectronAPI, FileDialogOptions, NotificationPayload, SystemInfo } from '../shared/types';

const apiBridge: ElectronAPI = {
  platform: process.platform,
  isElectron: true,
  getSystemInfo: (): Promise<SystemInfo> => ipcRenderer.invoke(IPCChannels.SYSTEM_GET_INFO),
  showNotification: (payload: NotificationPayload): Promise<boolean> =>
    ipcRenderer.invoke(IPCChannels.DIALOG_NOTIFY, payload),
  openFileDialog: (options?: FileDialogOptions): Promise<string[] | null> =>
    ipcRenderer.invoke(IPCChannels.DIALOG_OPEN_FILE, options),
  minimizeWindow: (): void => ipcRenderer.send(IPCChannels.WINDOW_MINIMIZE),
  maximizeWindow: (): void => ipcRenderer.send(IPCChannels.WINDOW_MAXIMIZE),
  closeWindow: (): void => ipcRenderer.send(IPCChannels.WINDOW_CLOSE),
};

try {
  contextBridge.exposeInMainWorld('electronAPI', apiBridge);
} catch (error) {
  console.error('Failed to expose Electron API in contextBridge:', error);
}
