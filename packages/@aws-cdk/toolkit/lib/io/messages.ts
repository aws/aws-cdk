import * as chalk from 'chalk';
import { IoMessage, IoMessageCode, IoMessageCodeCategory, IoMessageLevel } from './io-host';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
 * Internal helper that processes log inputs into a consistent format.
 * Handles string interpolation, format strings, and object parameter styles.
 * Applies optional styling and prepares the final message for logging.
 */
function formatMessage<T>(
  msg: Pick<Optional<IoMessage<T>, 'code'>, 'level' | 'code' | 'message' | 'data'>,
  style?: (str: string) => string,
): Omit<IoMessage<T>, 'action'> {
  // Apply style if provided
  const formattedMessage = style ? style(msg.message) : msg.message;

  return {
    time: new Date(),
    level: msg.level,
    code: msg.code ?? messageCode(msg.level),
    message: formattedMessage,
    data: msg.data,
  };
}

/**
 * Build a message code from level and category
 */
function messageCode(level: IoMessageLevel, category: IoMessageCodeCategory = 'TOOLKIT', number?: `${number}${number}${number}${number}`): IoMessageCode {
  const levelIndicator = level === 'error' ? 'E' :
    level === 'warn' ? 'W' :
      'I';
  return `CDK_${category}_${levelIndicator}${number ?? '0000'}`;
}

/**
 * Logs an error level message.
 */
export const error = <T>(message: string, code?: IoMessageCode, payload?: T) => {
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
export const warning = <T>(message: string, code?: IoMessageCode, payload?: T) => {
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
export const info = <T>(message: string, code?: IoMessageCode, payload?: T) => {
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
export const data = <T>(message: string, code?: IoMessageCode, payload?: T) => {
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
export const debug = <T>(message: string, code?: IoMessageCode, payload?: T) => {
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
export const trace = <T>(message: string, code?: IoMessageCode, payload?: T) => {
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
export const success = <T>(message: string, code?: IoMessageCode, payload?: T) => {
  return formatMessage({
    level: 'info',
    code,
    message,
    data: payload,
  }, chalk.green);
};

/**
 * Logs an info level message in bold text.
 * @deprecated
 */
export const highlight = <T>(message: string, code?: IoMessageCode, payload?: T) => {
  return formatMessage({
    level: 'info',
    code,
    message,
    data: payload,
  }, chalk.bold);
};
