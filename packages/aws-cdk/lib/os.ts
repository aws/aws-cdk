import * as child_process from 'child_process';
import * as chalk from 'chalk';
import { renderArguments, renderCommandLine } from './helper';
import { debug } from './logging';

/**
 * OS helpers
 *
 * Shell function which both prints to stdout and collects the output into a
 * string.
 */
export async function shell(command: string[]): Promise<string> {
  const commandLine = renderCommandLine(command);
  debug(`Executing ${chalk.blue(commandLine)}`);
  const child = child_process.spawn(command[0], renderArguments(command.slice(1)), {
    // Need this for Windows where we want .cmd and .bat to be found as well.
    shell: true,
    stdio: ['ignore', 'pipe', 'inherit'],
  });

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<any>();

    // Both write to stdout and collect
    child.stdout.on('data', chunk => {
      process.stdout.write(chunk);
      stdout.push(chunk);
    });

    child.once('error', reject);

    child.once('exit', code => {
      if (code === 0) {
        resolve(Buffer.from(stdout).toString('utf-8'));
      } else {
        reject(new Error(`${commandLine} exited with error code ${code}`));
      }
    });
  });
}