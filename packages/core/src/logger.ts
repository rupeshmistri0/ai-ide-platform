// Reusable, environment-aware structured logger for Next.js (Client & Server) and Electron

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogPayload {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
}

export class StructuredLogger {
  private namespace: string;
  private minLevel: LogLevel;
  private logFilePath?: string;
  private isServer: boolean;
  private fsModule: any;
  private pathModule: any;

  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(namespace: string, minLevel: LogLevel = 'info', logFileName = 'app.log') {
    this.namespace = namespace;
    this.minLevel = minLevel;
    this.isServer = typeof window === 'undefined';

    if (this.isServer) {
      try {
        // Safe runtime dynamic imports to avoid breaking client-side browser bundlers
        this.fsModule = require('fs');
        this.pathModule = require('path');
        
        const logDir = this.pathModule.join(process.cwd(), 'logs');
        if (!this.fsModule.existsSync(logDir)) {
          this.fsModule.mkdirSync(logDir, { recursive: true });
        }
        this.logFilePath = this.pathModule.join(logDir, logFileName);
      } catch (err) {
        // Fallback gracefully if filesystem access is restricted or not available (e.g. Vercel serverless)
        this.logFilePath = undefined;
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.minLevel];
  }

  private formatMessage(payload: LogPayload): string {
    const timeStr = payload.timestamp;
    const levelStr = payload.level.toUpperCase();
    const metaStr = payload.metadata && Object.keys(payload.metadata).length > 0
      ? ` | meta: ${JSON.stringify(payload.metadata)}`
      : '';
    return `[${timeStr}] [${levelStr}] [${this.namespace}] - ${payload.message}${metaStr}`;
  }

  private writeToFile(payload: LogPayload) {
    if (!this.isServer || !this.logFilePath || !this.fsModule) return;
    try {
      const line = JSON.stringify(payload) + '\n';
      this.fsModule.appendFileSync(this.logFilePath, line, 'utf8');
    } catch (err) {
      // Silently ignore log write failures to prevent crashing applications
    }
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>) {
    if (!this.shouldLog(level)) return;

    const payload: LogPayload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    };

    // 1. Console Output
    const formattedConsole = this.formatMessage(payload);
    
    // Colored tags in development browser or Node terminal
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      const colors = {
        debug: '\x1b[38;5;244m',
        info: '\x1b[36m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
        reset: '\x1b[0m',
      };
      const color = colors[level] || colors.reset;
      const formattedColorMessage = `[${payload.timestamp}]${color} [${level.toUpperCase()}]${colors.reset} [${this.namespace}] - ${payload.message}${payload.metadata ? ` | meta: ${JSON.stringify(payload.metadata)}` : ''}`;
      
      switch (level) {
        case 'debug':
          console.debug(formattedColorMessage);
          break;
        case 'info':
          console.info(formattedColorMessage);
          break;
        case 'warn':
          console.warn(formattedColorMessage);
          break;
        case 'error':
          console.error(formattedColorMessage);
          break;
      }
    } else {
      // Structured JSON output in production consoles
      console.log(JSON.stringify(payload));
    }

    // 2. File output (Server-side/Node context only)
    this.writeToFile(payload);
  }

  public debug(message: string, metadata?: Record<string, any>) {
    this.log('debug', message, metadata);
  }

  public info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, metadata);
  }

  public warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', message, metadata);
  }

  public error(message: string, metadata?: Record<string, any>) {
    this.log('error', message, metadata);
  }
}

// Global logger instance
export const appLogger = new StructuredLogger('app_platform', 'info');
