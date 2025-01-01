import { Writable } from 'stream';
import * as util from 'util';
import * as chalk from 'chalk';
import { IoMessageLevel, IoMessage, CliIoHost, validateMessageCode } from './toolkit/cli-io-host';

// Corking mechanism
let CORK_COUNTER = 0;
const logBuffer: [Writable, string][] = [];

const levelPriority: Record<IoMessageLevel, number> = {
  ['error']: 0,
  ['warn']: 1,
  ['info']: 2,
  ['debug']: 3,
  ['trace']: 4,
};

let currentIoMessageThreshold: IoMessageLevel = 'info';

/**
 * Sets the current threshold. Messages with a lower priority level will be ignored.
 * @param level - The new log level to set
 */
export function setIoMessageThreshold(level: IoMessageLevel) {
  currentIoMessageThreshold = level;
}

/**
 * Sets whether the logger is running in CI mode.
 * In CI mode, all non-error output goes to stdout instead of stderr.
 * @param newCI - Whether CI mode should be enabled
 */
export function setCI(newCI: boolean) {
  CliIoHost.ci = newCI;
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

export interface LogOptions {
  /**
   * The log level to use
   */
  level: IoMessageLevel;
  /**
   * The message to log
   */
  message: string;
  /**
   * Whether to force stdout
   * @default false
   */
  forceStdout?: boolean;
  /**
   * The message code
   * @default TOOLKIT_2000, TOOLKIT_1000, or TOOLKIT_0000 depending on log level
   */
  code?: string;
}

/**
 * Core logging function that utilizes the CLI IO host to write messages to the console.
 * @param entry - LogEntry object or log level
 * @param fmt - Format string (when using with log level)
 * @param args - Format arguments (when using with log level)
 */
export function log(options: LogOptions) {
  // Check if we should log this level
  if (levelPriority[options.level] > levelPriority[currentIoMessageThreshold]) {
    return;
  }

  // Determine if a provided message code is valid, otherwise if no message code is provided, defaults
  // to the appropriate generic TOOLKIT code. 0000 for error, 1000 for warning, and 2000 for info and above.
  if (options.code) {
    if (!validateMessageCode(options.code)) {
      throw new Error(`Invalid message code: ${options.code}`);
    }
  } else {
    options.code = `TOOLKIT_${Math.min(levelPriority[options.level] - 1, 2)}000`;
  }

  // Get appropriate stream - pass through forceStdout flag
  const stream = CliIoHost.getStream(options.level, options.forceStdout ?? false);

  // Handle corking
  if (CORK_COUNTER > 0) {
    logBuffer.push([stream, options.message]);
    return;
  }

  const ioMessage: IoMessage = {
    level: options.level,
    message: options.message,
    forceStdout: options.forceStdout,
    time: new Date(),
    action: CliIoHost.currentAction ?? 'none',
    code: options.code,
  };

  // Write to stream
  void CliIoHost.getIoHost().notify(ioMessage);
}

// local convenienceLog function, takes in
function convenienceLog(
  level: IoMessageLevel,
  forceStdout = false,
  fmt: string,
  style?: (str: string) => string,
  ...args: unknown[]): void {
  let message: string;
  let code: string | undefined;

  if (args.length === 0) {
    // If no additional args, fmt is the message
    message = fmt;
  } else {
    // Check if the first argument is a message code
    if (validateMessageCode(fmt)) {
      code = fmt;
      // Use the first arg as format string and rest as format args
      message = String(args[0]);
      if (args.length > 1) {
        try {
          message = util.format(String(args[0]), ...args.slice(1));
        } catch (e) {
          throw new Error(`Invalid format string formatting for args ${fmt} ${args}\n${e}`);
        }
      }
    } else {
      // Use fmt as format string and all args as format args
      try {
        message = util.format(fmt, ...args);
      } catch (e) {
        throw new Error(`Invalid format string formatting for args ${fmt} ${args}\n${e}`);
      }
    }
  }
  if (style) {
    message = style(message);
  }

  log({
    level,
    message,
    code,
    forceStdout,
  });
}
// Convenience logging functions
/**
 * Convenience function for logging an error level message.
 * @param message The message to log
 * @param code An optional code of format [A-Z_]+_[0-2]\d{3}, defaults to `TOOLKIT_0000`
 */
export const error = (fmt: string, ...args: unknown[]) => {
  return convenienceLog('error', false, fmt, undefined, ...args);
};

/**
 * Convenience function for logging a warning error message.
 * @param message The message to log
 * @param code An optional code of format [A-Z_]+_[0-2]\d{3}, defaults to `TOOLKIT_1000`
 */
export const warning = (fmt: string, ...args: unknown[]) => {
  convenienceLog('warn', false, fmt, undefined, ...args);
};

/**
 * Convenience function for logging an info level message.
 * @param message The message to log
 * @param code An optional code of format [A-Z_]+_[0-2]\d{3}, defaults to `TOOLKIT_2000`
 */
export const info = (fmt: string, ...args: unknown[]) => {
  convenienceLog('info', false, fmt, undefined, ...args);
};

/**
  * duplicate of the {@link info} logging function for convenience.
  */
export const print = info;

/**
 * Convenience function for logging an info level message. Always prints to stdout stream.
 * @param message The message to log
 * @param code An optional code of format [A-Z_]+_[0-2]\d{3}, defaults to `TOOLKIT_2000`
 */
export const data = (fmt: string, ...args: unknown[]) => {
  convenienceLog('info', true, fmt, undefined, ...args);
};

/**
 * Convenience function for logging an debug level message.
 * @param message The message to log
 * @param code An optional code of format [A-Z_]+_[0-2]\d{3}, defaults to `TOOLKIT_2000`
 */
export const debug = (fmt: string, ...args: unknown[]) => {
  convenienceLog('debug', false, fmt, undefined, ...args);
};

/**
 * Convenience function for logging a trace level message.
 * @param message The message to log
 * @param code An optional code of format [A-Z_]+_[0-2]\d{3}, defaults to `TOOLKIT_2000`
 */
export const trace = (fmt: string, ...args: unknown[]) => {
  convenienceLog('trace', false, fmt, undefined, ...args);
};

/**
 * Convenience function for logging an info level message that colors the text green
 * @param message The message to log
 * @param code An optional code of format [A-Z_]+_[0-2]\d{3}, defaults to `TOOLKIT_2000`
 */
export const success = (fmt: string, ...args: unknown[]) => {
  convenienceLog('info', false, fmt, chalk.green, ...args);
};

/**
 * Convenience function for logging an info level message that bolds the text
 * @param message The message to log
 * @param code An optional code of format [A-Z_]+_[0-2]\d{3}, defaults to `TOOLKIT_2000`
 */
export const highlight = (fmt: string, ...args: unknown[]) => {
  convenienceLog('info', false, fmt, chalk.bold, ...args);
};

