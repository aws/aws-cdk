import * as childProcess from 'child_process';
import * as process from 'process';
import * as colors from 'colors/safe';
import * as yargs from 'yargs';
import { debug, print, warning } from '../../lib/logging';
import { CommandOptions } from '../command-api';

export const command = 'docs';
export const describe = 'Opens the reference documentation in a browser';
export const aliases = ['doc'];

const defaultBrowserCommand: { [key in NodeJS.Platform]?: string } = {
  darwin: 'open %u',
  win32: 'start %u',
};

export const builder = {
  browser: {
    alias: 'b',
    desc: 'the command to use to open the browser, using %u as a placeholder for the path of the file to open',
    type: 'string',
    default: process.platform in defaultBrowserCommand ? defaultBrowserCommand[process.platform] : 'xdg-open %u',
  },
};

export interface Arguments extends yargs.Arguments {
  browser: string
}

export function handler(args: yargs.Arguments) {
  args.commandHandler = realHandler;
}

export async function realHandler(options: CommandOptions): Promise<number> {
  const url = 'https://docs.aws.amazon.com/cdk/api/latest/';
  print(colors.green(url));
  const browserCommand = (options.args.browser as string).replace(/%u/g, url);
  debug(`Opening documentation ${colors.green(browserCommand)}`);
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
