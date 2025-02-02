import * as child_process from 'node:child_process';
import { ToolkitError } from '../../errors';

interface ExecOptions {
  extraEnv?: { [key: string]: string | undefined };
  cwd?: string;
}

/**
 * Execute a command and args in a child process
 */
export async function execInChildProcess(commandAndArgs: string, options: ExecOptions = {}) {
  return new Promise<void>((ok, fail) => {
    // We use a slightly lower-level interface to:
    //
    // - Pass arguments in an array instead of a string, to get around a
    //   number of quoting issues introduced by the intermediate shell layer
    //   (which would be different between Linux and Windows).
    //
    // - Inherit stderr from controlling terminal. We don't use the captured value
    //   anyway, and if the subprocess is printing to it for debugging purposes the
    //   user gets to see it sooner. Plus, capturing doesn't interact nicely with some
    //   processes like Maven.
    const proc = child_process.spawn(commandAndArgs, {
      stdio: ['ignore', 'inherit', 'inherit'],
      detached: false,
      shell: true,
      cwd: options.cwd,
      env: {
        ...process.env,
        ...(options.extraEnv ?? {}),
      },
    });

    proc.on('error', fail);

    proc.on('exit', code => {
      if (code === 0) {
        return ok();
      } else {
        return fail(new ToolkitError(`Subprocess exited with error ${code}`));
      }
    });
  });
}
