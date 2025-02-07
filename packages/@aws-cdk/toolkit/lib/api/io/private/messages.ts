import * as chalk from 'chalk';
import type { IoMessageCodeCategory, IoMessageLevel } from '../io-message';
import { type VALID_CODE } from './codes';
import type { ActionLessMessage, ActionLessRequest, Optional, SimplifiedMessage } from './types';

/**
 * Internal helper that processes log inputs into a consistent format.
 * Handles string interpolation, format strings, and object parameter styles.
 * Applies optional styling and prepares the final message for logging.
 */
export function formatMessage<T>(msg: Optional<SimplifiedMessage<T>, 'code'>, category: IoMessageCodeCategory = 'TOOLKIT'): ActionLessMessage<T> {
  return {
    time: new Date(),
    level: msg.level,
    code: msg.code ?? defaultMessageCode(msg.level, category),
    message: msg.message,
    data: msg.data,
  };
}

/**
 * Build a message code from level and category. The code must be valid for this function to pass.
 * Otherwise it returns a ToolkitError.
 */
export function defaultMessageCode(level: IoMessageLevel, category: IoMessageCodeCategory = 'TOOLKIT'): VALID_CODE {
  const levelIndicator = level === 'error' ? 'E' :
    level === 'warn' ? 'W' :
      'I';
  return `CDK_${category}_${levelIndicator}0000` as VALID_CODE;
}

/**
 * Requests a yes/no confirmation from the IoHost.
 */
export const confirm = (
  code: VALID_CODE,
  question: string,
  motivation: string,
  defaultResponse: boolean,
  concurrency?: number,
): ActionLessRequest<{
  motivation: string;
  concurrency?: number;
}, boolean> => {
  return prompt(code, `${chalk.cyan(question)} (y/n)?`, defaultResponse, {
    motivation,
    concurrency,
  });
};

/**
 * Prompt for a a response from the IoHost.
 */
export const prompt = <T, U>(code: VALID_CODE, message: string, defaultResponse: U, payload?: T): ActionLessRequest<T, U> => {
  return {
    defaultResponse,
    ...formatMessage({
      level: 'info',
      code,
      message,
      data: payload,
    }),
  };
};

/**
 * Creates an error level message.
 * Errors must always have a unique code.
 */
export const error = <T>(message: string, code: VALID_CODE, payload?: T) => {
  return formatMessage({
    level: 'error',
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
export const result = <T>(message: string, code: VALID_CODE, payload: T) => {
  return formatMessage({
    level: 'result',
    code,
    message,
    data: payload,
  });
};

/**
 * Creates a warning level message.
 */
export const warn = <T>(message: string, code?: VALID_CODE, payload?: T) => {
  return formatMessage({
    level: 'warn',
    code,
    message,
    data: payload,
  });
};

/**
 * Creates an info level message.
 */
export const info = <T>(message: string, code?: VALID_CODE, payload?: T) => {
  return formatMessage({
    level: 'info',
    code,
    message,
    data: payload,
  });
};

/**
 * Creates a debug level message.
 */
export const debug = <T>(message: string, code?: VALID_CODE, payload?: T) => {
  return formatMessage({
    level: 'debug',
    code,
    message,
    data: payload,
  });
};

/**
 * Creates a trace level message.
 */
export const trace = <T>(message: string, code?: VALID_CODE, payload?: T) => {
  return formatMessage({
    level: 'trace',
    code,
    message,
    data: payload,
  });
};

/**
 * Creates an info level success message in green text.
 * @deprecated
 */
export const success = <T>(message: string, code?: VALID_CODE, payload?: T) => {
  return formatMessage({
    level: 'info',
    code,
    message: chalk.green(message),
    data: payload,
  });
};

/**
 * Creates an info level message in bold text.
 * @deprecated
 */
export const highlight = <T>(message: string, code?: VALID_CODE, payload?: T) => {
  return formatMessage({
    level: 'info',
    code,
    message: chalk.bold(message),
    data: payload,
  });
};
