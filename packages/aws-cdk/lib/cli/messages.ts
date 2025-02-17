// This file is a backport from @aws-cdk/toolkit.
// The CLI cannot depend on the toolkit yet, because the toolkit currently depends on the CLI.
// Once we have complete the repo split, we will create a temporary, private library package
// for all code that is shared between CLI and toolkit. This is where this file will then live.
import { IoMessage, IoMessageCode, IoMessageCodeCategory, IoMessageLevel, ToolkitAction } from '../toolkit/cli-io-host';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type SimplifiedMessage<T> = Omit<IoMessage<T>, 'time'>;

/**
 * Internal helper that processes log inputs into a consistent format.
 * Handles string interpolation, format strings, and object parameter styles.
 * Applies optional styling and prepares the final message for logging.
 */
function formatMessage<T>(msg: Optional<SimplifiedMessage<T>, 'code'>, category: IoMessageCodeCategory = 'TOOLKIT'): IoMessage<T> {
  return {
    time: new Date(),
    level: msg.level,
    action: msg.action,
    code: msg.code ?? defaultMessageCode(msg.level, category),
    message: msg.message,
    data: msg.data,
  };
}

/**
 * Build a message code from level and category. The code must be valid for this function to pass.
 * Otherwise it returns a ToolkitError.
 */
function defaultMessageCode(level: IoMessageLevel, category: IoMessageCodeCategory = 'TOOLKIT'): IoMessageCode {
  const levelIndicator = level === 'error' ? 'E' :
    level === 'warn' ? 'W' :
      'I';
  return `CDK_${category}_${levelIndicator}0000`;
}

/**
 * Creates an error level message.
 * Errors must always have a unique code.
 */
export const error = <T>(action: ToolkitAction, message: string, code: IoMessageCode, payload?: T) => {
  return formatMessage({
    level: 'error',
    action,
    code,
    message,
    data: payload,
  });
};

/**
 * Creates a result level message and represents the most important message for a given action.
 *
 * They should be used sparsely, with an action usually having no or exactly one result.
 * However actions that operate on Cloud Assemblies might include a result per Stack.
 * Unlike other messages, results must always have a code and a payload.
 */
export const result = <T>(action: ToolkitAction, message: string, code: IoMessageCode, payload: T) => {
  return formatMessage({
    level: 'result',
    action,
    code,
    message,
    data: payload,
  });
};

/**
 * Creates a warning level message.
 */
export const warn = <T>(action: ToolkitAction, message: string, code?: IoMessageCode, payload?: T) => {
  return formatMessage({
    level: 'warn',
    action,
    code,
    message,
    data: payload,
  });
};

/**
 * Creates an info level message.
 */
export const info = <T>(action: ToolkitAction, message: string, code?: IoMessageCode, payload?: T) => {
  return formatMessage({
    level: 'info',
    action,
    code,
    message,
    data: payload,
  });
};

/**
 * Creates a debug level message.
 */
export const debug = <T>(action: ToolkitAction, message: string, code?: IoMessageCode, payload?: T) => {
  return formatMessage({
    level: 'debug',
    action,
    code,
    message,
    data: payload,
  });
};

/**
 * Creates a trace level message.
 */
export const trace = <T>(action: ToolkitAction, message: string, code?: IoMessageCode, payload?: T) => {
  return formatMessage({
    level: 'trace',
    action,
    code,
    message,
    data: payload,
  });
};

