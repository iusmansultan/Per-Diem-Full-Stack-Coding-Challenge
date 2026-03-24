/**
 * Simple logger utility for the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'debug';

function formatMessage(log: LogMessage): string {
  const dataStr = log.data ? ` ${JSON.stringify(log.data)}` : '';
  return `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}${dataStr}`;
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function createLog(level: LogLevel, message: string, data?: Record<string, unknown>): void {
  if (!shouldLog(level)) return;

  const log: LogMessage = {
    level,
    message,
    timestamp: new Date().toISOString(),
    data,
  };

  const formatted = formatMessage(log);

  switch (level) {
    case 'error':
      console.error(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    default:
      console.log(formatted);
  }
}

export const logger = {
  debug: (message: string, data?: Record<string, unknown>) => createLog('debug', message, data),
  info: (message: string, data?: Record<string, unknown>) => createLog('info', message, data),
  warn: (message: string, data?: Record<string, unknown>) => createLog('warn', message, data),
  error: (message: string, data?: unknown) => {
    const errorData = data instanceof Error 
      ? { message: data.message, stack: data.stack }
      : (typeof data === 'object' ? data as Record<string, unknown> : { error: data });
    createLog('error', '', errorData);
  },
  request: (method: string, path: string, status: number, startTime: number, message?: string) => {
    const duration = Date.now() - startTime;
    const logMessage = `${method} ${path} - ${status} (${duration}ms)${message ? ` - ${message}` : ''}`;
    createLog('info', logMessage);
  },
};
