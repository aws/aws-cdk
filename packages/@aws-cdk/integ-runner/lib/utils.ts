// Helper functions for CDK Exec
import { spawnSync } from 'child_process';

/**
 * Our own execute function which doesn't use shells and strings.
 */
export function exec(commandLine: string[], options: { cwd?: string; verbose?: boolean; env?: any } = { }): any {
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

/**
 * Split command to chunks by space
 */
export function chunks(command: string): string[] {
  const result = command.match(/(?:[^\s"]+|"[^"]*")+/g);
  return result ?? [];
}

/**
 * A class holding a set of items which are being crossed off in time
 *
 * If it takes too long to cross off a new item, print the list.
 */
export class WorkList<A> {
  private readonly remaining = new Set(this.items);
  private readonly timeout: number;
  private timer?: NodeJS.Timeout;

  constructor(private readonly items: A[], private readonly options: WorkListOptions<A> = {}) {
    this.timeout = options.timeout ?? 60_000;
    this.scheduleTimer();
  }

  public crossOff(item: A) {
    this.remaining.delete(item);
    this.stopTimer();
    if (this.remaining.size > 0) {
      this.scheduleTimer();
    }
  }

  public done() {
    this.remaining.clear();
    this.stopTimer();
  }

  private stopTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  private scheduleTimer() {
    this.timer = setTimeout(() => this.report(), this.timeout);
  }

  private report() {
    this.options.onTimeout?.(this.remaining);
  }
}

export interface WorkListOptions<A> {
  /**
   * When to reply with remaining items
   *
   * @default 60000
   */
  readonly timeout?: number;

  /**
   * Function to call when timeout hits
   */
  readonly onTimeout?: (x: Set<A>) => void;
}
