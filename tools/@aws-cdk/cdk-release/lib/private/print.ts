import * as util from 'util';

export interface LoggingOptions {
  verbose?: boolean;
  silent?: boolean;
}

export function debug(opts: LoggingOptions, message: string): void {
  if (opts.verbose) {
    // eslint-disable-next-line no-console
    console.log(`[cdk-release] ${message}`);
  }
}

export function debugObject(opts: LoggingOptions, message: string, object: any): void {
  if (opts.verbose) {
    // eslint-disable-next-line no-console
    console.log(`[cdk-release] ${message}:\n`, object);
  }
}

export function notify(opts: LoggingOptions, msg: string, args: any[]) {
  if (!opts.silent) {
    // eslint-disable-next-line no-console
    console.info('✔ ' + util.format(msg, ...args));
  }
}
