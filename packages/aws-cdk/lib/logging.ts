import * as util from 'util';
import * as chalk from 'chalk';
import { IoMessageLevel, IoMessage, CliIoHost, IoMessageSpecificCode, IoMessageCode, IoMessageCodeCategory, IoCodeLevel } from './toolkit/cli-io-host';

/**
 * Internal helper that processes log inputs into a consistent format.
 * Handles string interpolation, format strings, and object parameter styles.
 * Applies optional styling and sends the message to the IoHost.
 */
function formatMessageAndLog(
  level: IoMessageLevel,
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

  const ioHost = CliIoHost.instance();
  const ioMessage: IoMessage<undefined> = {
    time: new Date(),
    action: ioHost.currentAction,
    level,
    message: finalMessage,
    code,
  };

  void ioHost.notify(ioMessage);
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
  return formatMessageAndLog('error', input, undefined, ...args);
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
  return formatMessageAndLog('warn', input, undefined, ...args);
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
  return formatMessageAndLog('info', input, undefined, ...args);
};

/**
 * Logs an result. In the CLI, this always goes to stdout.
 *
 * Can be used in multiple ways:
 * ```ts
 * result(`${JSON.stringify(stats)}`) // infers default info code `CDK_TOOLKIT_I000`
 * result('{"count": %d}', count) // infers default info code `CDK_TOOLKIT_I000`
 * result({ message: 'stats: %j', code: 'CDK_DATA_I001' }) // specifies info code `CDK_DATA_I001`
 * result({ message: 'stats: %j', code: 'CDK_DATA_I001' }, stats) // specifies info code `CDK_DATA_I001`
 * ```
 */
export const result = (input: LogInput<'I'>, ...args: unknown[]) => {
  return formatMessageAndLog('result', input, undefined, ...args);
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
  return formatMessageAndLog('debug', input, undefined, ...args);
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
  return formatMessageAndLog('trace', input, undefined, ...args);
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
  return formatMessageAndLog('info', input, chalk.green, ...args);
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
  return formatMessageAndLog('info', input, chalk.bold, ...args);
};
