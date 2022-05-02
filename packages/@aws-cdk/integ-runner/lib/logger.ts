import { Writable } from 'stream';
import * as util from 'util';
import * as chalk from 'chalk';

type StyleFn = (str: string) => string;
const { stderr } = process;

const logger = (stream: Writable, styles?: StyleFn[]) => (fmt: string, ...args: any[]) => {
  let str = util.format(fmt, ...args);
  if (styles && styles.length) {
    str = styles.reduce((a, style) => style(a), str);
  }
  stream.write(str + '\n');
};

export const print = logger(stderr);
export const error = logger(stderr, [chalk.red]);
export const warning = logger(stderr, [chalk.yellow]);
export const success = logger(stderr, [chalk.green]);
export const highlight = logger(stderr, [chalk.bold]);
