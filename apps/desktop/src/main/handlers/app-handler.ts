import { ipcMain, app } from 'electron';
import * as os from 'os';
import { IPCChannels } from '../../shared/channels';
import { SystemInfo } from '../../shared/types';

export function registerAppHandlers() {
  ipcMain.handle(IPCChannels.SYSTEM_GET_INFO, (): SystemInfo => {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.versions.node,
      electronVersion: process.versions.electron,
      appVersion: app.getVersion(),
      totalMemoryMB: Math.round(os.totalmem() / (1024 * 1024)),
    };
  });
}
