import * as child_process from 'child_process';
import * as shlex from 'shlex';

export interface ShellOptions {
  readonly cwd?: string;
  readonly quiet?: boolean;
}

export async function shell(command: string, options: ShellOptions = {}): Promise<string> {
  const parts = shlex.split(command);
  const child = child_process.spawn(parts[0], parts.slice(1), {
    // Need this for Windows where we want .cmd and .bat to be found as well.
    shell: true,
    cwd: options.cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<any>();

    const quiet = options.quiet ?? false;

    child.stdout!.on('data', chunk => {
      if (!quiet) {
        process.stdout.write(chunk);
      }
      stdout.push(chunk);
    });

    child.stderr!.on('data', chunk => {
      process.stderr.write(chunk.toString());
    });

    child.once('error', reject);
    child.once('exit', code => {
      if (code === 0) {
        resolve(Buffer.concat(stdout).toString('utf-8'));
      } else {
        reject(new Error(`Command '${command}' exited with error code ${code}`));
      }
    });
  });
}
