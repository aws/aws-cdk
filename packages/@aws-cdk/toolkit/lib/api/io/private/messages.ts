import * as chalk from 'chalk';
import type { IoMessageCode, IoMessageCodeCategory, IoMessageLevel } from '../io-message';
import type { VALID_CODE } from './codes';
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
    code: msg.code ?? messageCode(msg.level, category),
    message: msg.message,
    data: msg.data,
  };
}

/**
 * Build a message code from level and category
 */
export function messageCode(level: IoMessageLevel, category: IoMessageCodeCategory = 'TOOLKIT', number?: `${number}${number}${number}${number}`): IoMessageCode {
  const levelIndicator = level === 'error' ? 'E' :
    level === 'warn' ? 'W' :
      'I';
  return `CDK_${category}_${levelIndicator}${number ?? '0000'}`;
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
 * Logs an error level message.
 */
export const error = <T>(message: string, code?: VALID_CODE, payload?: T) => {
  return formatMessage({
    level: 'error',
    code,
    message,
    data: payload,
  });
};

/**
 * Logs an warning level message.
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
 * Logs an info level message.
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
 * Logs an info level message to stdout.
 * @deprecated
 */
export const data = <T>(message: string, code?: VALID_CODE, payload?: T) => {
  return formatMessage({
    level: 'info',
    code,
    message,
    data: payload,
  });
};

/**
 * Logs a debug level message.
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
 * Logs a trace level message.
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
 * Logs an info level success message in green text.
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
 * Logs an info level message in bold text.
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
