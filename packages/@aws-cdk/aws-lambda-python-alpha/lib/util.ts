import type { SpawnSyncOptions } from 'child_process';
import { spawnSync } from 'child_process';
import { UnscopedValidationError } from 'aws-cdk-lib';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';

/** @internal */
export function runCommand(cmd: string, args: string[], options?: SpawnSyncOptions): void {
  const proc = spawnSync(cmd, args, options);

  if (proc.error) {
    throw proc.error;
  }

  if (proc.status === 0) {
    return;
  }

  const stdout = proc.stdout?.toString().trim() ?? '';
  const stderr = proc.stderr?.toString().trim() ?? '';
  const detail = stdout || stderr
    ? `[Status ${proc.status}] ${cmd} ${args.join(' ')}\nstdout: ${stdout}\nstderr: ${stderr}`
    : `${cmd} ${args.join(' ')} exited with status ${proc.status}`;
  throw new UnscopedValidationError(lit`PythonLocalBundlingCommandFailed`, detail);
}
