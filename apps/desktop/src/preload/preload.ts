import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('apiBridge', {
  platform: process.platform,
  sendNotification: (message: string) => ipcRenderer.send('notify', message)
});
