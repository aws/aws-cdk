import * as cp from 'child_process';
import { promisify } from 'util';
import { notify, LoggingOptions, debug } from './print';

const execFile = promisify(cp.execFile);

type RunOptions = LoggingOptions & { readonly dryRun?: boolean };

export async function runExecFile(args: RunOptions, cmd: string, cmdArgs: string[], options?: cp.ExecFileOptions): Promise<string | undefined> {
  if (args.dryRun) {
    notify(args, "would execute command: '%s'", [fmtCommandArgs(cmd, cmdArgs)]);
    return;
  }
  debug(args, `＞ ${fmtCommandArgs(cmd, cmdArgs)}`);
  const streams = await execFile(cmd, cmdArgs, options);
  return streams.stdout.toString('utf-8');
}

function fmtCommandArgs(cmd: string, cmdArgs: string[]) {
  return `${cmd} ${cmdArgs.map(cmdArg => cmdArg.match(/\s/) ? `"${cmdArg}"` : cmdArg).join(' ')}`.trim();
}
