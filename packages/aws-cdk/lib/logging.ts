import { Writable } from 'stream';
import * as util from 'util';
import * as chalk from 'chalk';

/**
 * Available log levels in order of increasing verbosity.
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

/**
 * Configuration options for a log entry.
 */
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

/**
 * Determines which output stream to use based on log level and configuration.
 * @param level - The log level to determine stream for
 * @param forceStdout - Whether to force stdout regardless of level
 * @returns The appropriate Writable stream
 */
const getStream = (level: LogLevel, forceStdout?: boolean): Writable => {
  // Special case - data() calls should always go to stdout
  if (forceStdout) {
    return stdout;
  }
  if (level === LogLevel.ERROR) return stderr;
  return CI ? stdout : stderr;
};

const levelPriority: Record<LogLevel, number> = {
  [LogLevel.ERROR]: 0,
  [LogLevel.WARN]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.DEBUG]: 3,
  [LogLevel.TRACE]: 4,
};

let currentLogLevel: LogLevel = LogLevel.INFO;

/**
 * Sets the current log level. Messages with a lower priority level will be filtered out.
 * @param level - The new log level to set
 */
export function setLogLevel(level: LogLevel) {
  currentLogLevel = level;
}

/**
 * Sets whether the logger is running in CI mode.
 * In CI mode, all non-error output goes to stdout instead of stderr.
 * @param newCI - Whether CI mode should be enabled
 */
export function setCI(newCI: boolean) {
  CI = newCI;
}

/**
 * Formats a date object into a timestamp string (HH:MM:SS).
 * @param d - Date object to format
 * @returns Formatted time string
 */
function formatTime(d: Date): string {
  const pad = (n: number): string => n.toString().padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * Executes a block of code with corked logging. All log messages during execution
 * are buffered and only written after the block completes.
 * @param block - Async function to execute with corked logging
 * @returns Promise that resolves with the block's return value
 */
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

/**
 * Core logging function that handles all log output.
 * @param entry - LogEntry object or log level
 * @param fmt - Format string (when using with log level)
 * @param args - Format arguments (when using with log level)
 */
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

  // Add timestamp first if requested
  if (entry.timestamp) {
    finalMessage = `[${formatTime(new Date())}] ${finalMessage}`;
  }

  // Add prefix AFTER timestamp
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

// Convenience logging methods
export const error = (fmt: string, ...args: unknown[]) => log(LogLevel.ERROR, fmt, ...args);
export const warning = (fmt: string, ...args: unknown[]) => log(LogLevel.WARN, fmt, ...args);
export const info = (fmt: string, ...args: unknown[]) => log(LogLevel.INFO, fmt, ...args);
export const print = (fmt: string, ...args: unknown[]) => log(LogLevel.INFO, fmt, ...args);
export const data = (fmt: string, ...args: unknown[]) => log({
  level: LogLevel.INFO,
  message: util.format(fmt, ...args),
  forceStdout: true,
});
export const debug = (fmt: string, ...args: unknown[]) => log({
  level: LogLevel.DEBUG,
  message: util.format(fmt, ...args),
  timestamp: true,
});

export const trace = (fmt: string, ...args: unknown[]) => log({
  level: LogLevel.TRACE,
  message: util.format(fmt, ...args),
  timestamp: true,
});

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

/**
 * Creates a logging function that prepends a prefix to all messages.
 * @param prefixString - String to prepend to all messages
 * @param level - Log level to use (defaults to INFO)
 * @returns Logging function that accepts format string and arguments
 */
export function prefix(prefixString: string, level: LogLevel = LogLevel.INFO): (fmt: string, ...args: unknown[]) => void {
  return (fmt: string, ...args: unknown[]) => log({
    level,
    message: util.format(fmt, ...args),
    prefix: prefixString,
  });
}
