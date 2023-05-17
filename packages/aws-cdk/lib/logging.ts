import { Writable } from 'stream';
import * as util from 'util';
import * as chalk from 'chalk';

type StyleFn = (str: string) => string;
const { stdout, stderr } = process;

type WritableFactory = () => Writable;

const logger = (stream: Writable | WritableFactory, styles?: StyleFn[], timestamp?: boolean) => (fmt: string, ...args: unknown[]) => {
  const ts = timestamp ? `[${formatTime(new Date())}] ` : '';

  let str = ts + util.format(fmt, ...args);
  if (styles && styles.length) {
    str = styles.reduce((a, style) => style(a), str);
  }


  const realStream = typeof stream === 'function' ? stream() : stream;
  realStream.write(str + '\n');
};

function formatTime(d: Date) {
  return `${lpad(d.getHours(), 2)}:${lpad(d.getMinutes(), 2)}:${lpad(d.getSeconds(), 2)}`;

  function lpad(x: any, w: number) {
    const s = `${x}`;
    return '0'.repeat(Math.max(w - s.length, 0)) + s;
  }
}

export enum LogLevel {
  /** Not verbose at all */
  DEFAULT = 0,
  /** Pretty verbose */
  DEBUG = 1,
  /** Extremely verbose */
  TRACE = 2
}


export let logLevel = LogLevel.DEFAULT;
export let CI = false;

export function setLogLevel(newLogLevel: LogLevel) {
  logLevel = newLogLevel;
}

export function setCI(newCI: boolean) {
  CI = newCI;
}

export function increaseVerbosity() {
  logLevel += 1;
}

const stream = () => CI ? stdout : stderr;
const _debug = logger(stream, [chalk.gray], true);

export const trace = (fmt: string, ...args: unknown[]) => logLevel >= LogLevel.TRACE && _debug(fmt, ...args);
export const debug = (fmt: string, ...args: unknown[]) => logLevel >= LogLevel.DEBUG && _debug(fmt, ...args);
export const error = logger(stderr, [chalk.red]);
export const warning = logger(stream, [chalk.yellow]);
export const success = logger(stream, [chalk.green]);
export const highlight = logger(stream, [chalk.bold]);
export const print = logger(stream);
export const data = logger(stdout);

export type LoggerFunction = (fmt: string, ...args: unknown[]) => void;

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
