// Helper functions for CDK Exec
import { spawnSync } from 'child_process';

/**
 * Our own execute function which doesn't use shells and strings.
 */
export function exec(commandLine: string[], options: { cwd?: string, verbose?: boolean, env?: any } = { }): any {
  const proc = spawnSync(commandLine[0], commandLine.slice(1), {
    stdio: ['ignore', 'pipe', options.verbose ? 'inherit' : 'pipe'], // inherit STDERR in verbose mode
    env: {
      ...process.env,
      ...options.env,
    },
    cwd: options.cwd,
  });

  if (proc.error) { throw proc.error; }
  if (proc.status !== 0) {
    if (process.stderr) { // will be 'null' in verbose mode
      process.stderr.write(proc.stderr);
    }
    throw new Error(`Command exited with ${proc.status ? `status ${proc.status}` : `signal ${proc.signal}`}`);
  }

  const output = proc.stdout.toString('utf-8').trim();

  return output;
}

/**
 * Flatten a list of lists into a list of elements
 */
export function flatten<T>(xs: T[][]): T[] {
  return Array.prototype.concat.apply([], xs);
}

/**
 * Chain commands
 */
export function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}
