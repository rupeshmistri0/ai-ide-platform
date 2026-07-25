export type ThemeMode = 'dark' | 'light' | 'system';

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  formatOnSave: boolean;
  vimMode: boolean;
  wordWrap: 'on' | 'off' | 'wordWrapColumn';
  fontFamily: string;
  lineNumbers: 'on' | 'off' | 'relative';
}

export interface AISettings {
  defaultModel: string;
  temperature: number;
  topP: number;
  streamResponses: boolean;
  systemPrompt: string;
  maxTokens?: number;
  autoSuggest?: boolean;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  securityAlerts: boolean;
  productUpdates?: boolean;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: ThemeMode;
  editorSettings: EditorSettings;
  aiSettings: AISettings;
  notificationSettings: NotificationSettings;
  createdAt: string;
  updatedAt: string;
}
