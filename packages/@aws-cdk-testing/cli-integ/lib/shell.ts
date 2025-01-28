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

  const outputs = new Set(options.outputs);
  const writeToOutputs = (x: string) => {
    for (const outputStream of outputs) {
      outputStream.write(x);
    }
  };

  const show = options.show ?? 'always';
  const verbose = Boolean(process.env.VERBOSE);

  if (verbose) {
    outputs.add(process.stdout);
  }

  // Always output the command
  writeToOutputs(`💻 ${command.join(' ')} (show: ${show}, verbose: ${verbose})\n`);

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
      if (show === 'always') {
        writeToOutputs(chunk);
      }
      stdout.push(chunk);
    });

    child.stderr!.on('data', chunk => {
      if (show === 'always') {
        writeToOutputs(chunk);
      }
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
        if (show === 'error') {
          writeToOutputs(`${out}\n`);
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
  readonly modEnv?: Record<string, string | undefined>;

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
   */
  readonly outputs?: NodeJS.WritableStream[];

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

  public async shell(command: string[], options: Omit<ShellOptions, 'cwd' | 'outputs'> = {}): Promise<string> {
    return shell(command, {
      outputs: [this._output],
      cwd: this._cwd,
      ...options,
    });
  }
}

/**
 * rm -rf reimplementation, don't want to depend on an NPM package for this
 *
 * Returns `true` if everything got deleted, or `false` if some files could
 * not be deleted due to permissions issues.
 */
export function rimraf(fsPath: string): boolean {
  try {
    let success = true;
    const isDir = fs.lstatSync(fsPath).isDirectory();

    if (isDir) {
      for (const file of fs.readdirSync(fsPath)) {
        success &&= rimraf(path.join(fsPath, file));
      }
      fs.rmdirSync(fsPath);
    } else {
      fs.unlinkSync(fsPath);
    }
    return success;
  } catch (e: any) {
    // Can happen if some files got generated inside a Docker container and are now inadvertently owned by `root`.
    // We can't ever clean those up anymore, but since it only happens inside GitHub Actions containers we also don't care too much.
    if (e.code === 'EACCES' || e.code === 'ENOTEMPTY') { return false; }

    // Already gone
    if (e.code === 'ENOENT') { return true; }

    throw e;
  }
}

export function addToShellPath(x: string) {
  const parts = process.env.PATH?.split(':') ?? [];

  if (!parts.includes(x)) {
    parts.unshift(x);
  }

  process.env.PATH = parts.join(':');
}
