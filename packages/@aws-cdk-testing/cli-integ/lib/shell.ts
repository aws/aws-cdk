import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { TestContext } from './integ-test';
import { TemporaryDirectoryContext } from './with-temporary-directory';

/**
 * A shell command that does what you want
 *
 * Is platform-aware, handles errors nicely.
 */
export async function shell(command: string[], options: ShellOptions = {}): Promise<string> {
  if (options.modEnv && options.env) {
    throw new Error('Use either env or modEnv but not both');
  }

  // Always output the command
  (options.output ?? process.stdout).write(`💻 ${command.join(' ')}\n`);

  let output: NodeJS.WritableStream | undefined = options.output ?? process.stdout;
  switch (options.show ?? 'always') {
    case 'always':
      break;
    case 'never':
    case 'error':
      output = undefined;
      break;
  }

  if (process.env.VERBOSE) {
    output = process.stdout;
  }

  const env = options.env ?? (options.modEnv ? { ...process.env, ...options.modEnv } : process.env);

  const child = child_process.spawn(command[0], command.slice(1), {
    ...options,
    env,
    // Need this for Windows where we want .cmd and .bat to be found as well.
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<Buffer>();
    const stderr = new Array<Buffer>();

    child.stdout!.on('data', chunk => {
      output?.write(chunk);
      stdout.push(chunk);
    });

    child.stderr!.on('data', chunk => {
      output?.write(chunk);
      if (options.captureStderr ?? true) {
        stderr.push(chunk);
      }
    });

    child.once('error', reject);

    child.once('close', code => {
      const stderrOutput = Buffer.concat(stderr).toString('utf-8');
      const stdoutOutput = Buffer.concat(stdout).toString('utf-8');
      const out = (options.onlyStderr ? stderrOutput : stdoutOutput + stderrOutput).trim();
      if (code === 0 || options.allowErrExit) {
        resolve(out);
      } else {
        if (options.show === 'error') {
          (options.output ?? process.stdout).write(out + '\n');
        }
        reject(new Error(`'${command.join(' ')}' exited with error code ${code}.`));
      }
    });
  });
}

export interface ShellOptions extends child_process.SpawnOptions {
  /**
   * Properties to add to 'env'
   */
  readonly modEnv?: Record<string, string>;

  /**
   * Don't fail when exiting with an error
   *
   * @default false
   */
  readonly allowErrExit?: boolean;

  /**
   * Whether to capture stderr
   *
   * @default true
   */
  readonly captureStderr?: boolean;

  /**
   * Pass output here
   *
   * @default stdout unless quiet=true
   */
  readonly output?: NodeJS.WritableStream;

  /**
   * Only return stderr. For example, this is used to validate
   * that when CI=true, all logs are sent to stdout.
   *
   * @default false
   */
  readonly onlyStderr?: boolean;

  /**
   * Don't log to stdout
   *
   * @default always
   */
  readonly show?: 'always' | 'never' | 'error';
}

export class ShellHelper {
  public static fromContext(context: TestContext & TemporaryDirectoryContext) {
    return new ShellHelper(context.integTestDir, context.output);
  }

  constructor(
    private readonly _cwd: string,
    private readonly _output: NodeJS.WritableStream) { }

  public async shell(command: string[], options: Omit<ShellOptions, 'cwd' | 'output'> = {}): Promise<string> {
    return shell(command, {
      output: this._output,
      cwd: this._cwd,
      ...options,
    });
  }
}

/**
 * rm -rf reimplementation, don't want to depend on an NPM package for this
 */
export function rimraf(fsPath: string) {
  try {
    const isDir = fs.lstatSync(fsPath).isDirectory();

    if (isDir) {
      for (const file of fs.readdirSync(fsPath)) {
        rimraf(path.join(fsPath, file));
      }
      fs.rmdirSync(fsPath);
    } else {
      fs.unlinkSync(fsPath);
    }
  } catch (e: any) {
    // We will survive ENOENT
    if (e.code !== 'ENOENT') { throw e; }
  }
}

export function addToShellPath(x: string) {
  const parts = process.env.PATH?.split(':') ?? [];

  if (!parts.includes(x)) {
    parts.unshift(x);
  }

  process.env.PATH = parts.join(':');
}
