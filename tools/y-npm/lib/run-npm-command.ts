import { spawn } from 'child_process';
import { debug, error } from '../lib/logging';

export const NO_ADDITIONAL_ENV = undefined;
export const QUIET = true;

export type ExitStatus = { code: number, signal?: undefined }
             | { code?: undefined, signal: string };

export class CommandResult {
  constructor(public readonly exitStatus: ExitStatus, public readonly stdout: Buffer, public readonly stderr: Buffer) {}

  public assertSuccess(showStderrOnFailure: boolean = true) {
    if (!this.success && showStderrOnFailure) {
      process.stderr.write(this.stderr);
    }
    if (this.signaled) {
      throw new Error(`The process received signal: ${this.exitStatus.signal}`);
    }
    if (!this.success) {
      throw new Error(`The process exited with status: ${this.exitCode}`);
    }
  }

  public get success(): boolean {
    return this.exitStatus.code === 0;
  }

  public get signaled(): boolean {
    return this.exitStatus.signal != null;
  }

  public get exitCode(): number {
    return this.exitStatus.code != null ? this.exitStatus.code : 128;
  }
}

/**
 * Executes ``npm`` with the provided arguments and inheriting the current
 * process' environment, with optional additional environment variables.
 * The command's ``stdin``, ``stdout`` and ``stderr`` will be inherited from
 * the current process.
 *
 * @param args      the CLI arguments to be passed to ``npm``
 * @param additionalEnv the extra environment variables to provide to the
 *            ``npm`` command.
 * @param silent    whether output should not be forwarded to stdout.
 *
 * @returns the exit status of the ``npm`` command, and it's standard output.
 */
export async function runNpmCommand(args: string[], additionalEnv?: NodeJS.ProcessEnv, silent: boolean = false): Promise<CommandResult> {
  return await runCommand('npm', args, additionalEnv, silent);
}

/**
 * Executes a command with the provided arguments and inheriting the current
 * process' environment, with optional additional environment variables.
 * The command's ``stdin``, ``stdout`` and ``stderr`` will be inherited from
 * the current process.
 *
 * @param command     the command to be invoked
 * @param args      the CLI arguments to be passed to the ``command``
 * @param additionalEnv the extra environment variables to provide to the
 *            ``command``.
 * @param silent    whether output should not be forwarded to stdout.
 *
 * @returns the exit status of the ``command``, and it's standard output.
 */
export function runCommand(command: string, args: string[], additionalEnv?: NodeJS.ProcessEnv, silent: boolean = false): Promise<CommandResult> {
  return new Promise<CommandResult>((resolve, reject) => {
    try {
      debug(`Additional environment variables: ${JSON.stringify(additionalEnv)}`);
      debug(`Command: ${command} ${args.join(' ')}`);
      const env = { ...process.env };
      for (const key of Object.keys(additionalEnv || {})) {
        const value = additionalEnv![key];
        if (value == null) {
          delete env[key];
        } else {
          env[key] = value;
        }
      }
      // `shell: true` is required because on Windows, batch files must be run from a shell, and y-npm
      // is invoked using the batch file y-npm.cmd (to work around symlink issues on Windows).
      const child = spawn(command, args, { detached: false, env, shell: true, stdio: ['inherit', 'pipe', 'pipe'] });
      debug(`Command PID: ${child.pid}`);
      const stdout = new Array<Buffer>();
      const stderr = new Array<Buffer>();
      child.stdout.on('data', chunk => {
        if (!silent) { process.stdout.write(chunk); }
        stdout.push(chunk as Buffer);
      });
      child.stderr.on('data', chunk => {
        if (!silent) { process.stderr.write(chunk); }
        stderr.push(chunk as Buffer);
      });
      child.on('close', (code, signal) => {
        if (code != null) {
          (code === 0 ? debug : error)(`Child exited with status ${code}`);
          resolve(new CommandResult({ code }, Buffer.concat(stdout), Buffer.concat(stderr)));
        } else {
          error(`Child received signal ${signal}`);
          resolve(new CommandResult({ signal }, Buffer.concat(stdout), Buffer.concat(stderr)));
        }
      });
    } catch (err) {
      error(err.stack);
      reject(error);
    }
  });
}
