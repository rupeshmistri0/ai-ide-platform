export interface SystemInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  electronVersion: string;
  appVersion: string;
  totalMemoryMB: number;
}

export interface NotificationPayload {
  title: string;
  body: string;
}

export interface FileDialogOptions {
  title?: string;
  filters?: { name: string; extensions: string[] }[];
}

export interface ElectronAPI {
  platform: string;
  isElectron: boolean;
  getSystemInfo: () => Promise<SystemInfo>;
  showNotification: (payload: NotificationPayload) => Promise<boolean>;
  openFileDialog: (options?: FileDialogOptions) => Promise<string[] | null>;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
