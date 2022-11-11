import * as cp from 'child_process';
import { promisify } from 'util';
import { notify, LoggingOptions } from './print';

const execFile = promisify(cp.execFile);

type RunOptions = LoggingOptions & { readonly dryRun?: boolean };

export async function runExecFile(args: RunOptions, cmd: string, cmdArgs: string[], options?: cp.ExecFileOptions): Promise<string | undefined> {
  if (args.dryRun) {
    notify(args, "would execute command: '%s %s'", [cmd, cmdArgs
      // quote arguments with spaces, for a more realistic printing experience
      .map(cmdArg => cmdArg.match(/\s/) ? `"${cmdArg}"` : cmdArg)
      .join(' ')],
    );
    return;
  }
  const streams = await execFile(cmd, cmdArgs, options);
  return streams.stdout.toString('utf-8');
}
