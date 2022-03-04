import * as child_process from 'child_process';

export interface ShellOptions {
  readonly cwd?: string;
  readonly quiet?: boolean;
}

export function shell(command: string, options: ShellOptions = {}): string {
  const stdio: child_process.StdioOptions = options.quiet ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'inherit', 'inherit'];
  const buffer = child_process.execSync(command, {
    cwd: options.cwd,
    stdio: stdio,
  });
  return buffer ? buffer.toString('utf-8').trim() : '';
}
