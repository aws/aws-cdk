import { Writable } from 'stream';
import * as util from 'util';
import * as chalk from 'chalk';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp?: boolean;
  prefix?: string;
  style?: ((str: string) => string);
  forceStdout?: boolean;
}

const { stdout, stderr } = process;

// Corking mechanism
let CORK_COUNTER = 0;
const logBuffer: [Writable, string][] = [];

// Style mappings
const styleMap: Record<LogLevel, (str: string) => string> = {
  [LogLevel.ERROR]: chalk.red,
  [LogLevel.WARN]: chalk.yellow,
  [LogLevel.INFO]: chalk.white,
  [LogLevel.DEBUG]: chalk.gray,
  [LogLevel.TRACE]: chalk.gray,
};

// Stream selection
let CI = false;
const getStream = (level: LogLevel, forceStdout?: boolean): Writable => {
  // Special case - data() calls should always go to stdout
  if (forceStdout) {
    return stdout;
  }
  if (level === LogLevel.ERROR) return stderr;
  return CI ? stdout : stderr;
};

// Level control
const levelPriority: Record<LogLevel, number> = {
  [LogLevel.ERROR]: 0,
  [LogLevel.WARN]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.DEBUG]: 3,
  [LogLevel.TRACE]: 4,
};

let currentLogLevel: LogLevel = LogLevel.INFO;

export function setLogLevel(level: LogLevel) {
  currentLogLevel = level;
}

export function setCI(newCI: boolean) {
  CI = newCI;
}

function formatTime(d: Date): string {
  const pad = (n: number): string => n.toString().padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export async function withCorkedLogging<T>(block: () => Promise<T>): Promise<T> {
  CORK_COUNTER++;
  try {
    return await block();
  } finally {
    CORK_COUNTER--;
    if (CORK_COUNTER === 0) {
      logBuffer.forEach(([stream, str]) => stream.write(str + '\n'));
      logBuffer.splice(0);
    }
  }
}

export function log(entry: LogEntry): void;
export function log(level: LogLevel, fmt: string, ...args: unknown[]): void;
export function log(levelOrEntry: LogLevel | LogEntry, fmt?: string, ...args: unknown[]): void {
  // Normalize input
  const entry: LogEntry = typeof levelOrEntry === 'string'
    ? { level: levelOrEntry as LogLevel, message: util.format(fmt!, ...args) }
    : levelOrEntry;

  // Check if we should log this level
  if (levelPriority[entry.level] > levelPriority[currentLogLevel]) {
    return;
  }

  // Format the message
  let finalMessage = entry.message;

  // Add timestamp if requested
  if (entry.timestamp) {
    finalMessage = `[${formatTime(new Date())}] ${finalMessage}`;
  }

  // Add prefix if provided
  if (entry.prefix) {
    finalMessage = `${entry.prefix} ${finalMessage}`;
  }

  // Apply custom style if provided, otherwise use level-based style
  const style = entry.style || styleMap[entry.level];
  finalMessage = style(finalMessage);

  // Get appropriate stream - pass through forceStdout flag
  const stream = getStream(entry.level, entry.forceStdout);

  // Handle corking
  if (CORK_COUNTER > 0) {
    logBuffer.push([stream, finalMessage]);
    return;
  }

  // Write to stream
  stream.write(finalMessage + '\n');
}

// Convenience methods that match the original API
export const error = (fmt: string, ...args: unknown[]) => log(LogLevel.ERROR, fmt, ...args);
export const warning = (fmt: string, ...args: unknown[]) => log(LogLevel.WARN, fmt, ...args);
export const info = (fmt: string, ...args: unknown[]) => log(LogLevel.INFO, fmt, ...args);
export const print = (fmt: string, ...args: unknown[]) => log(LogLevel.INFO, fmt, ...args);
export const data = (fmt: string, ...args: unknown[]) => log({
  level: LogLevel.INFO,
  message: util.format(fmt, ...args),
  forceStdout: true, // Force stdout for data() calls
});
export const debug = (fmt: string, ...args: unknown[]) => log(LogLevel.DEBUG, fmt, ...args);
export const trace = (fmt: string, ...args: unknown[]) => log(LogLevel.TRACE, fmt, ...args);

// onvenience methods using custom styles
export const success = (fmt: string, ...args: unknown[]) => log({
  level: LogLevel.INFO,
  message: util.format(fmt, ...args),
  style: chalk.green,
});

export const highlight = (fmt: string, ...args: unknown[]) => log({
  level: LogLevel.INFO,
  message: util.format(fmt, ...args),
  style: chalk.bold,
});

// Helper for creating prefixed loggers
export function prefix(prefixString: string, level: LogLevel = LogLevel.INFO): (fmt: string, ...args: unknown[]) => void {
  return (fmt: string, ...args: unknown[]) => log({
    level,
    message: util.format(fmt, ...args),
    prefix: prefixString,
  });
}