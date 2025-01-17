import * as util from 'util';
import * as chalk from 'chalk';
import { IoMessageLevel, IoMessage, CliIoHost, IoMessageSpecificCode, IoMessageCode, IoMessageCodeCategory, IoCodeLevel, levelPriority } from './toolkit/cli-io-host';

// Corking mechanism
let CORK_COUNTER = 0;
const logBuffer: IoMessage<any>[] = [];

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
        void CliIoHost.instance().notify(ioMessage);
      }
      logBuffer.splice(0);
    }
  }
}

interface LogMessage {
  /**
   * The log level to use
   */
  readonly level: IoMessageLevel;
  /**
   * The message to log
   */
  readonly message: string;
  /**
   * Whether to force stdout
   * @default false
   */
  readonly forceStdout?: boolean;
  /**
   * Message code of the format [CATEGORY]_[NUMBER_CODE]
   * @pattern [A-Z]+_[0-2][0-9]{3}
   * @default TOOLKIT_[0/1/2]000
   */
  readonly code: IoMessageCode;
}

/**
 * Internal core logging function that writes messages through the CLI IO host.
 * @param msg Configuration options for the log message. See  {@link LogMessage}
 */
function log(msg: LogMessage) {
  const ioMessage: IoMessage<undefined> = {
    level: msg.level,
    message: msg.message,
    forceStdout: msg.forceStdout,
    time: new Date(),
    action: CliIoHost.instance().currentAction,
    code: msg.code,
  };

  if (CORK_COUNTER > 0) {
    if (levelPriority[msg.level] > levelPriority[CliIoHost.instance().logLevel]) {
      return;
    }
    logBuffer.push(ioMessage);
    return;
  }

  void CliIoHost.instance().notify(ioMessage);
}

/**
 * Internal helper that processes log inputs into a consistent format.
 * Handles string interpolation, format strings, and object parameter styles.
 * Applies optional styling and prepares the final message for logging.
 */
function formatMessageAndLog(
  level: IoMessageLevel,
  forceStdout: boolean,
  input: LogInput<IoCodeLevel>,
  style?: (str: string) => string,
  ...args: unknown[]
): void {
  // Extract message and code from input, using new default code format
  const { message, code = getDefaultCode(level) } = typeof input === 'object' ? input : { message: input };

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

function getDefaultCode(level: IoMessageLevel, category: IoMessageCodeCategory = 'TOOLKIT'): IoMessageCode {
  const levelIndicator = level === 'error' ? 'E' :
    level === 'warn' ? 'W' :
      'I';
  return `CDK_${category}_${levelIndicator}0000`;
}

// Type for the object parameter style
interface LogParams<L extends IoCodeLevel> {
  /**
   * @see {@link IoMessage.code}
   */
  readonly code?: IoMessageSpecificCode<L>;
  /**
   * @see {@link IoMessage.message}
   */
  readonly message: string;
}

// Type for the exported log function arguments
type LogInput<L extends IoCodeLevel> = string | LogParams<L>;

// Exported logging functions. If any additional logging functionality is required, it should be added as
// a new logging function here.

/**
 * Logs an error level message.
 *
 * Can be used in multiple ways:
 * ```ts
 * error(`operation failed: ${e}`) // infers default error code `CDK_TOOLKIT_E000`
 * error('operation failed: %s', e) // infers default error code `CDK_TOOLKIT_E000`
 * error({ message: 'operation failed', code: 'CDK_SDK_E001' }) // specifies error code `CDK_SDK_E001`
 * error({ message: 'operation failed: %s', code: 'CDK_SDK_E001' }, e) // specifies error code `CDK_SDK_E001`
 * ```
 */
export const error = (input: LogInput<'E'>, ...args: unknown[]) => {
  return formatMessageAndLog('error', false, input, undefined, ...args);
};

/**
 * Logs an warning level message.
 *
 * Can be used in multiple ways:
 * ```ts
 * warning(`deprected feature: ${message}`) // infers default warning code `CDK_TOOLKIT_W000`
 * warning('deprected feature: %s', message) // infers default warning code `CDK_TOOLKIT_W000`
 * warning({ message: 'deprected feature', code: 'CDK_SDK_W001' }) // specifies warning code `CDK_SDK_W001`
 * warning({ message: 'deprected feature: %s', code: 'CDK_SDK_W001' }, message) // specifies warning code `CDK_SDK_W001`
 * ```
 */
export const warning = (input: LogInput<'W'>, ...args: unknown[]) => {
  return formatMessageAndLog('warn', false, input, undefined, ...args);
};

/**
 * Logs an info level message.
 *
 * Can be used in multiple ways:
 * ```ts
 * info(`processing: ${message}`) // infers default info code `CDK_TOOLKIT_I000`
 * info('processing: %s', message) // infers default info code `CDK_TOOLKIT_I000`
 * info({ message: 'processing', code: 'CDK_TOOLKIT_I001' }) // specifies info code `CDK_TOOLKIT_I001`
 * info({ message: 'processing: %s', code: 'CDK_TOOLKIT_I001' }, message) // specifies info code `CDK_TOOLKIT_I001`
 * ```
 */
export const info = (input: LogInput<'I'>, ...args: unknown[]) => {
  return formatMessageAndLog('info', false, input, undefined, ...args);
};

/**
 * Logs an info level message to stdout.
 *
 * Can be used in multiple ways:
 * ```ts
 * data(`${JSON.stringify(stats)}`) // infers default info code `CDK_TOOLKIT_I000`
 * data('{"count": %d}', count) // infers default info code `CDK_TOOLKIT_I000`
 * data({ message: 'stats: %j', code: 'CDK_DATA_I001' }) // specifies info code `CDK_DATA_I001`
 * data({ message: 'stats: %j', code: 'CDK_DATA_I001' }, stats) // specifies info code `CDK_DATA_I001`
 * ```
 */
export const data = (input: LogInput<'I'>, ...args: unknown[]) => {
  return formatMessageAndLog('info', true, input, undefined, ...args);
};

/**
 * Logs a debug level message.
 *
 * Can be used in multiple ways:
 * ```ts
 * debug(`state: ${JSON.stringify(state)}`) // infers default info code `CDK_TOOLKIT_I000`
 * debug('cache hit ratio: %d%%', ratio) // infers default info code `CDK_TOOLKIT_I000`
 * debug({ message: 'state update', code: 'CDK_TOOLKIT_I001' }) // specifies info code `CDK_TOOLKIT_I001`
 * debug({ message: 'ratio: %d%%', code: 'CDK_TOOLKIT_I001' }, ratio) // specifies info code `CDK_TOOLKIT_I001`
 * ```
 */
export const debug = (input: LogInput<'I'>, ...args: unknown[]) => {
  return formatMessageAndLog('debug', false, input, undefined, ...args);
};

/**
 * Logs a trace level message.
 *
 * Can be used in multiple ways:
 * ```ts
 * trace(`entered ${name} with ${args}`) // infers default info code `CDK_TOOLKIT_I000`
 * trace('method: %s, args: %j', name, args) // infers default info code `CDK_TOOLKIT_I000`
 * trace({ message: 'entered', code: 'CDK_TOOLKIT_I001' }) // specifies info code `CDK_TOOLKIT_I001`
 * trace({ message: 'method: %s', code: 'CDK_TOOLKIT_I001' }, name) // specifies info code `CDK_TOOLKIT_I001`
 * ```
 */
export const trace = (input: LogInput<'I'>, ...args: unknown[]) => {
  return formatMessageAndLog('trace', false, input, undefined, ...args);
};

/**
 * Logs an info level success message in green text.
 *
 * Can be used in multiple ways:
 * ```ts
 * success(`deployment completed: ${name}`) // infers default info code `CDK_TOOLKIT_I000`
 * success('processed %d items', count) // infers default info code `CDK_TOOLKIT_I000`
 * success({ message: 'completed', code: 'CDK_TOOLKIT_I001' }) // specifies info code `CDK_TOOLKIT_I001`
 * success({ message: 'items: %d', code: 'CDK_TOOLKIT_I001' }, count) // specifies info code `CDK_TOOLKIT_I001`
 * ```
 */
export const success = (input: LogInput<'I'>, ...args: unknown[]) => {
  return formatMessageAndLog('info', false, input, chalk.green, ...args);
};

/**
 * Logs an info level message in bold text.
 *
 * Can be used in multiple ways:
 * ```ts
 * highlight(`important: ${msg}`) // infers default info code `CDK_TOOLKIT_I000`
 * highlight('attention required: %s', reason) // infers default info code `CDK_TOOLKIT_I000`
 * highlight({ message: 'notice', code: 'CDK_TOOLKIT_I001' }) // specifies info code `CDK_TOOLKIT_I001`
 * highlight({ message: 'notice: %s', code: 'CDK_TOOLKIT_I001' }, msg) // specifies info code `CDK_TOOLKIT_I001`
 * ```
 */
export const highlight = (input: LogInput<'I'>, ...args: unknown[]) => {
  return formatMessageAndLog('info', false, input, chalk.bold, ...args);
};
