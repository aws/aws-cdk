import * as child_process from 'child_process';
import chalk from 'chalk';
import * as shlex from 'shlex';

export async function shell(command: string): Promise<string> {
  const parts = shlex.split(command);
  const child = child_process.spawn(parts[0], parts.slice(1), {
    // Need this for Windows where we want .cmd and .bat to be found as well.
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const makeRed = process.stderr.isTTY ? chalk.red : (x: string) => x;

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<any>();

    child.stdout!.on('data', chunk => {
      process.stdout.write(chunk);
      stdout.push(chunk);
    });

    child.stderr!.on('data', chunk => {
      process.stderr.write(makeRed(chunk.toString()));
    });

    child.once('error', reject);
    child.once('exit', code => {
      if (code === 0) {
        resolve(Buffer.concat(stdout).toString('utf-8'));
      } else {
        reject(new Error(`${parts[0]} exited with error code ${code}`));
      }
    });
  });
}
