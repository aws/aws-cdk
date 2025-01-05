import * as util from 'util';
import * as chalk from 'chalk';
import { IoMessageLevel, IoMessage, CliIoHost, validateMessageCode } from './toolkit/cli-io-host';

// Corking mechanism
let CORK_COUNTER = 0;
const logBuffer: IoMessage[] = [];

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
 * are buffered and only written when all nested cork blocks complete (when CORK_COUNTER reaches 0).
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
      // Process each buffered message through notify
      for (const ioMessage of logBuffer) {
        void CliIoHost.getIoHost().notify(ioMessage);
      }
      logBuffer.splice(0);
    }
  }
}

interface LogOptions {
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
 * Message code of the format [CATEGORY]_[NUMBER_CODE]
 * @pattern [A-Z]+_[0-2][0-9]{3}
 * @default TOOLKIT_[0/1/2]000
 */
  code?: string;
}

/**
 * Internal core logging function that writes messages through the CLI IO host.
 * @param options Configuration options for the log message. See  {@link LogOptions}
 */
function log(options: LogOptions) {
  if (levelPriority[options.level] > levelPriority[currentIoMessageThreshold]) {
    return;
  }

  if (options.code) {
    if (!validateMessageCode(options.code, options.level)) {
      throw new Error(`Invalid message code: ${options.code}`);
    }
  } else {
    options.code = `TOOLKIT_${Math.min(levelPriority[options.level] - 1, 2)}000`;
  }

  const ioMessage: IoMessage = {
    level: options.level,
    message: options.message,
    forceStdout: options.forceStdout,
    time: new Date(),
    action: CliIoHost.currentAction ?? 'none',
    code: options.code,
  };

  if (CORK_COUNTER > 0) {
    logBuffer.push(ioMessage);
    return;
  }

  void CliIoHost.getIoHost().notify(ioMessage);
}

/**
 * Internal helper that processes log inputs into a consistent format.
 * Handles string interpolation, format strings, and object parameter styles.
 * Applies optional styling and prepares the final message for logging.
 */
function formatLogMessage(
  level: IoMessageLevel,
  forceStdout = false,
  input: LogInput,
  style?: (str: string) => string,
  ...args: unknown[]
): void {
  // Extract message and code from input
  const { message, code = `TOOLKIT_${getCodeLevel(level)}000` } = typeof input === 'object'
    ? input
    : { message: input, code: undefined };

  // Format message if args are provided
  const formattedMessage = args.length > 0
    ? util.format(message, ...args)
    : message;

  // Apply style if provided
  const finalMessage = style ? style(formattedMessage) : formattedMessage;

  log({
    level,
    message: finalMessage,
    code,
    forceStdout,
  });
}

function getCodeLevel(level: IoMessageLevel): number {
  if (level === 'error') {
    return 0;
  } else if (level === 'warn') {
    return 1;
  } else {
    return 2;
  }
}

// Type for the object parameter style
interface LogParams {
  /**
   * @see {@link IoMessage.code}
   */
  code?: string;
  /**
   * @see {@link IoMessage.message}
   */
  message: string;
}

// Type for the exported log function arguments
type LogInput = string | LogParams;

// Exported logging functions. If any additional logging functionality is required, it should be added as
// a new logging function here.
/**
 * Logs an error level message.
 *
 * Can be used in multiple ways:
 * ```ts
 * error(`operation failed: ${e}`)                        // string interpolation
 * error('operation failed: %s', e)                       // format string
 * error({ message: 'operation failed', code: 'ERR_001' }) // object style
 * error({ message: 'operation failed: %s', code: 'ERR_001' }, e) // object with formatting
 * ```
 */
export const error = (input: LogInput, ...args: unknown[]) => {
  return formatLogMessage('error', false, input, undefined, ...args);
};

/**
 * Logs a warning level message.
 *
 * Can be used in multiple ways:
 * ```ts
 * warning(`deprecated feature: ${name}`)                 // string interpolation
 * warning({ message: 'deprecated feature', code: 'WARN_001' }) // object style
 * ```
 */
export const warning = (input: LogInput, ...args: unknown[]) => {
  return formatLogMessage('warn', false, input, undefined, ...args);
};

/**
 * Logs an info level message.
 *
 * Can be used in multiple ways:
 * ```ts
 * info(`processing: ${id}`)                            // string interpolation
 * info({ message: 'processing', code: 'INFO_001' })    // object style
 * ```
 */
export const info = (input: LogInput, ...args: unknown[]) => {
  return formatLogMessage('info', false, input, undefined, ...args);
};

/** Alias for the {@link info} logging function */
export const print = info;

/**
 * Logs an info level message to stdout.
 *
 * Can be used in multiple ways:
 * ```ts
 * data(`stats: ${stats}`)                            // string interpolation
 * data({ message: 'stats: %j', code: 'DATA_001' }, stats) // object style with formatting
 * ```
 */
export const data = (input: LogInput, ...args: unknown[]) => {
  return formatLogMessage('info', true, input, undefined, ...args);
};

/**
 * Logs a debug level message.
 *
 * Can be used in multiple ways:
 * ```ts
 * debug(`state: ${state}`)                            // string interpolation
 * debug({ message: 'state update', code: 'DBG_001' }) // object style
 * ```
 */
export const debug = (input: LogInput, ...args: unknown[]) => {
  return formatLogMessage('debug', false, input, undefined, ...args);
};

/**
 * Logs a trace level message.
 *
 * Can be used in multiple ways:
 * ```ts
 * trace(`entered: ${name}`)                           // string interpolation
 * trace({ message: 'entered', code: 'TRACE_001' })    // object style
 * ```
 */
export const trace = (input: LogInput, ...args: unknown[]) => {
  return formatLogMessage('trace', false, input, undefined, ...args);
};

/**
 * Logs an info level success message in green text.
 *
 * Can be used in multiple ways:
 * ```ts
 * success(`completed: ${name}`)                       // string interpolation
 * success({ message: 'completed', code: 'SUC_001' })  // object style
 * ```
 */
export const success = (input: LogInput, ...args: unknown[]) => {
  return formatLogMessage('info', false, input, chalk.green, ...args);
};

/**
 * Logs an info level message in bold text.
 *
 * Can be used in multiple ways:
 * ```ts
 * highlight(`important: ${msg}`)                      // string interpolation
 * highlight({ message: 'important', code: 'HIGH_001' }) // object style
 * ```
 */
export const highlight = (input: LogInput, ...args: unknown[]) => {
  return formatLogMessage('info', false, input, chalk.bold, ...args);
};
