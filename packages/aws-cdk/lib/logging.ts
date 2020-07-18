import { Writable } from 'stream';
import * as util from 'util';
import * as colors from 'colors/safe';

type StyleFn = (str: string) => string;
const { stdout, stderr } = process;

const logger = (stream: Writable, styles?: StyleFn[]) => (fmt: string, ...args: any[]) => {
  let str = util.format(fmt, ...args);
  if (styles && styles.length) {
    str = styles.reduce((a, style) => style(a), str);
  }
  stream.write(str + '\n');
};

export let logLevel = LogLevel.DEFAULT;

export function setLogLevel(newLogLevel: LogLevel) {
  logLevel = newLogLevel;
}

export function increaseVerbosity() {
  logLevel += 1;
}

const _debug = logger(stderr, [colors.gray]);

export const trace = (fmt: string, ...args: any) => logLevel >= LogLevel.TRACE && _debug(fmt, ...args);
export const debug = (fmt: string, ...args: any[]) => logLevel >= LogLevel.DEBUG && _debug(fmt, ...args);
export const error = logger(stderr, [colors.red]);
export const warning = logger(stderr, [colors.yellow]);
export const success = logger(stderr, [colors.green]);
export const highlight = logger(stderr, [colors.bold]);
export const print = logger(stderr);
export const data = logger(stdout);

export type LoggerFunction = (fmt: string, ...args: any[]) => void;

/**
 * Create a logger output that features a constant prefix string.
 *
 * @param prefixString the prefix string to be appended before any log entry.
 * @param fn   the logger function to be used (typically one of the other functions in this module)
 *
 * @returns a new LoggerFunction.
 */
export function prefix(prefixString: string, fn: LoggerFunction): LoggerFunction {
  return (fmt: string, ...args: any[]) => fn(`%s ${fmt}`, prefixString, ...args);
}

export const enum LogLevel {
  /** Not verbose at all */
  DEFAULT = 0,
  /** Pretty verbose */
  DEBUG = 1,
  /** Extremely verbose */
  TRACE = 2
}
