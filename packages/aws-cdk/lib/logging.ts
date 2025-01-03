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
 * @param level The new log level threshold
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
   * Message code in format [A-Z]+_[0-9]{4}
   * If not provided, defaults based on level:
   * - error: TOOLKIT_0000
   * - warn: TOOLKIT_1000
   * - info/debug/trace: TOOLKIT_2000
   */
  code?: string;
}

/**
 * Core logging function that writes messages through the CLI IO host.
 * @param options Configuration options for the log message. See  {@link LogOptions}
 */
export function log(options: LogOptions) {
  if (levelPriority[options.level] > levelPriority[currentIoMessageThreshold]) {
    return;
  }

  if (options.code) {
    if (!validateMessageCode(options.code)) {
      throw new Error(`Invalid message code: ${options.code}`);
    }
  } else {
    options.code = `TOOLKIT_${Math.min(levelPriority[options.level] - 1, 2)}000`;
  }

  const stream = CliIoHost.getStream(options.level, options.forceStdout ?? false);

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

  void CliIoHost.getIoHost().notify(ioMessage);
}

/**
 * Internal helper for formatting and logging messages with consistent behavior.
 * @param level Message severity level
 * @param forceStdout Whether to force stdout output
 * @param fmt Format string or message code
 * @param style Optional styling function to apply to the message
 * @param args If fmt is a message code: [formatString, ...formatArgs], otherwise: format arguments
 */
function convenienceLog(
  level: IoMessageLevel,
  forceStdout = false,
  fmt: string,
  style?: (str: string) => string,
  ...args: unknown[]
): void {
  let message: string;
  let code: string | undefined;

  if (args.length === 0) {
    message = fmt;
  } else {
    // Check if the first argument is a message code, if so use it as the code and format the rest.
    if (validateMessageCode(fmt)) {
      code = fmt;
      message = String(args[0]);
      if (args.length > 1) {
        try {
          message = util.format(String(args[0]), ...args.slice(1));
        } catch (e) {
          throw new Error(`Invalid format string formatting for args ${fmt} ${args}\n${e}`);
        }
      }
    // Otherwise, format fmt with args
    } else {
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

/**
 * Logs an error level message.
 *
 * Can optionally specify a message code by passing it as the first argument.
 * The remaining arguments are used for string formatting. See {@link validateMessageCode} for message code format.
 *
 * Can be used in any of the following ways:
 * ```ts
 * error(`operation failed: ${e}`)                        // error message with default error level code TOOLKIT_0000
 * error('operation failed: %s', e)                       // error message with default error level code TOOLKIT_0000
 * error('TOOLKIT_0002', `validation failed: ${reason}`)  // error message with specified error level code TOOLKIT_0002
 * error('TOOLKIT_0002', 'validation failed: %s', reason) // error message with specified error level code TOOLKIT_0002
 * ```
 */
export const error = (fmt: string, ...args: unknown[]) => {
  return convenienceLog('error', false, fmt, undefined, ...args);
};

/**
 * Logs a warning level message.
 *
 * Can optionally specify a message code by passing it as the first argument.
 * The remaining arguments are used for string formatting. See {@link validateMessageCode} for message code format.
 *
 * Can be used in any of the following ways:
 * ```ts
 * warning(`deprecated feature used: ${name}`)           // warning message with default warning level code TOOLKIT_1000
 * warning('deprecated feature used: %s', name)          // warning message with default warning level code TOOLKIT_1000
 * warning('TOOLKIT_1002', `missing config: ${key}`)     // warning message with specified warning level code TOOLKIT_1002
 * warning('TOOLKIT_1002', 'missing config: %s', key)    // warning message with specified warning level code TOOLKIT_1002
 * ```
 */
export const warning = (fmt: string, ...args: unknown[]) => {
  convenienceLog('warn', false, fmt, undefined, ...args);
};

/**
 * Logs an info level message.
 *
 * Can optionally specify a message code by passing it as the first argument.
 * The remaining arguments are used for string formatting. See {@link validateMessageCode} for message code format.
 *
 * Can be used in any of the following ways:
 * ```ts
 * info(`processing item: ${id}`)                       // info message with default info level code TOOLKIT_2000
 * info('processing item: %s', id)                      // info message with default info level code TOOLKIT_2000
 * info('TOOLKIT_2002', `starting task: ${name}`)       // info message with specified info level code TOOLKIT_2002
 * info('TOOLKIT_2002', 'starting task: %s', name)      // info message with specified info level code TOOLKIT_2002
 * ```
 */
export const info = (fmt: string, ...args: unknown[]) => {
  convenienceLog('info', false, fmt, undefined, ...args);
};

/** Alias for the {@link info} logging function */
export const print = info;

/**
 * Logs an info level message to stdout.
 *
 * Can optionally specify a message code by passing it as the first argument.
 * The remaining arguments are used for string formatting. See {@link validateMessageCode} for message code format.
 *
 * Can be used in any of the following ways:
 * ```ts
 * data(`operation stats: ${stats}`)                     // info message with default info level code TOOLKIT_2000
 * data('operation stats: %j', stats)                    // info message with default info level code TOOLKIT_2000
 * data('TOOLKIT_2002', `runtime metrics: ${metrics}`)   // info message with specified info level code TOOLKIT_2002
 * data('TOOLKIT_2002', 'runtime metrics: %j', metrics)  // info message with specified info level code TOOLKIT_2002
 * ```
 */
export const data = (fmt: string, ...args: unknown[]) => {
  convenienceLog('info', true, fmt, undefined, ...args);
};

/**
 * Logs a debug level message.
 *
 * Can optionally specify a message code by passing it as the first argument.
 * The remaining arguments are used for string formatting. See {@link validateMessageCode} for message code format.
 *
 * Can be used in any of the following ways:
 * ```ts
 * debug(`internal state: ${state}`)                     // debug message with default info level code TOOLKIT_2000
 * debug('internal state: %j', state)                    // debug message with default info level code TOOLKIT_2000
 * debug('TOOLKIT_2002', `call details: ${details}`)     // debug message with specified info level code TOOLKIT_2002
 * debug('TOOLKIT_2002', 'call details: %j', details)    // debug message with specified info level code TOOLKIT_2002
 * ```
 */
export const debug = (fmt: string, ...args: unknown[]) => {
  convenienceLog('debug', false, fmt, undefined, ...args);
};

/**
 * Logs a trace level message.
 *
 * Can optionally specify a message code by passing it as the first argument.
 * The remaining arguments are used for string formatting. See {@link validateMessageCode} for message code format.
 *
 * Can be used in any of the following ways:
 * ```ts
 * trace(`function entered: ${name}`)                    // trace message with default info level code TOOLKIT_2000
 * trace('function entered: %s', name)                   // trace message with default info level code TOOLKIT_2000
 * trace('TOOLKIT_2002', `method called: ${method}`)     // trace message with specified info level code TOOLKIT_2002
 * trace('TOOLKIT_2002', 'method called: %s', method)    // trace message with specified info level code TOOLKIT_2002
 * ```
 */
export const trace = (fmt: string, ...args: unknown[]) => {
  convenienceLog('trace', false, fmt, undefined, ...args);
};

/**
 * Logs an info level message in green text.
 *
 * Can optionally specify a message code by passing it as the first argument.
 * The remaining arguments are used for string formatting. See {@link validateMessageCode} for message code format.
 *
 * Can be used in any of the following ways:
 * ```ts
 * success(`operation completed: ${name}`)               // green info message with default info level code TOOLKIT_2000
 * success('operation completed: %s', name)              // green info message with default info level code TOOLKIT_2000
 * success('TOOLKIT_2002', `task finished: ${task}`)     // green info message with specified info level code TOOLKIT_2002
 * success('TOOLKIT_2002', 'task finished: %s', task)    // green info message with specified info level code TOOLKIT_2002
 * ```
 */
export const success = (fmt: string, ...args: unknown[]) => {
  convenienceLog('info', false, fmt, chalk.green, ...args);
};

/**
 * Logs an info level message in bold text.
 *
 * Can optionally specify a message code by passing it as the first argument.
 * The remaining arguments are used for string formatting. See {@link validateMessageCode} for message code format.
 *
 * Can be used in any of the following ways:
 * ```ts
 * highlight(`important update: ${message}`)              // bold info message with default info level code TOOLKIT_2000
 * highlight('important update: %s', message)             // bold info message with default info level code TOOLKIT_2000
 * highlight('TOOLKIT_2002', `critical info: ${info}`)    // bold info message with specified info level code TOOLKIT_2002
 * highlight('TOOLKIT_2002', 'critical info: %s', info)   // bold info message with specified info level code TOOLKIT_2002
 * ```
 */
export const highlight = (fmt: string, ...args: unknown[]) => {
  convenienceLog('info', false, fmt, chalk.bold, ...args);
};
