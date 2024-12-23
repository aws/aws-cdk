import * as childProcess from 'child_process';
import * as chalk from 'chalk';
import { debug, print, warning } from '../../lib/logging';

export const command = 'docs';
export const describe = 'Opens the reference documentation in a browser';
export const aliases = ['doc'];

/**
 * Options for the docs command
 */
export interface DocsOptions {
  /**
   * The command to use to open the browser
   */
  browser: string;
}

export async function docs(options: DocsOptions): Promise<number> {
  const url = 'https://docs.aws.amazon.com/cdk/api/v2/';
  print(chalk.green(url));
  const browserCommand = (options.browser).replace(/%u/g, url);
  debug(`Opening documentation ${chalk.green(browserCommand)}`);
  return new Promise<number>((resolve, _reject) => {
    childProcess.exec(browserCommand, (err, stdout, stderr) => {
      if (err) {
        debug(`An error occurred when trying to open a browser: ${err.stack || err.message}`);
        return resolve(0);
      }
      if (stdout) { debug(stdout); }
      if (stderr) { warning(stderr); }
      resolve(0);
    });
  });
}
