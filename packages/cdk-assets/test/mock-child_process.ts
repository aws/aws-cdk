import * as child_process from 'child_process';
import * as events from 'events';

if (!(child_process as any).spawn.mockImplementationOnce) {
  throw new Error('Call "jest.mock(\'child_process\');" at the top of the test file!');
}

export interface Invocation {
  commandLine: string[];
  cwd?: string;
  exitCode?: number;
  stdout?: string;

  /**
   * Only match a prefix of the command (don't care about the details of the arguments)
   */
  prefix?: boolean;
}

export function mockSpawn(...invocations: Invocation[]): () => void {
  let mock = (child_process.spawn as any);
  for (const _invocation of invocations) {
    const invocation = _invocation; // Mirror into variable for closure
    mock = mock.mockImplementationOnce((binary: string, args: string[], options: child_process.SpawnOptions) => {
      if (invocation.prefix) {
        // Match command line prefix
        expect([binary, ...args].slice(0, invocation.commandLine.length)).toEqual(invocation.commandLine);
      } else {
        // Match full command line
        expect([binary, ...args]).toEqual(invocation.commandLine);
      }

      if (invocation.cwd != null) {
        expect(options.cwd).toBe(invocation.cwd);
      }

      const child: any = new events.EventEmitter();
      child.stdin = new events.EventEmitter();
      child.stdin.write = jest.fn();
      child.stdin.end = jest.fn();
      child.stdout = new events.EventEmitter();
      child.stderr = new events.EventEmitter();

      if (invocation.stdout) {
        mockEmit(child.stdout, 'data', Buffer.from(invocation.stdout));
      }
      mockEmit(child, 'close', invocation.exitCode ?? 0);

      return child;
    });
  }

  mock.mockImplementation((binary: string, args: string[], _options: any) => {
    throw new Error(`Did not expect call of ${JSON.stringify([binary, ...args])}`);
  });

  return () => {
    expect(mock).toHaveBeenCalledTimes(invocations.length);
  };
}

/**
 * Must do this on the next tick, as emitter.emit() expects all listeners to have been attached already
 */
function mockEmit(emitter: events.EventEmitter, event: string, data: any) {
  setImmediate(() => {
    emitter.emit(event, data);
  });
}
