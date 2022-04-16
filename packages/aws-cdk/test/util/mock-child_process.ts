import * as child_process from 'child_process';
import * as events from 'events';

if (!(child_process as any).spawn.mockImplementationOnce) {
  throw new Error('Call "jest.mock(\'child_process\');" at the top of the test file!');
}

export interface Invocation {
  commandLine: string;
  cwd?: string;
  exitCode?: number;
  stdout?: string;

  /**
   * Run this function as a side effect, if present
   */
  sideEffect?: () => void;
}

export function mockSpawn(...invocations: Invocation[]) {
  let mock = (child_process.spawn as any);
  for (const _invocation of invocations) {
    const invocation = _invocation; // Mirror into variable for closure
    mock = mock.mockImplementationOnce((binary: string, options: child_process.SpawnOptions) => {
      expect(binary).toEqual(invocation.commandLine);

      if (invocation.cwd != null) {
        expect(options.cwd).toBe(invocation.cwd);
      }

      if (invocation.sideEffect) {
        invocation.sideEffect();
      }

      const child: any = new events.EventEmitter();
      child.stdin = new events.EventEmitter();
      child.stdin.write = jest.fn();
      child.stdin.end = jest.fn();
      child.stdout = new events.EventEmitter();
      child.stderr = new events.EventEmitter();

      if (invocation.stdout) {
        mockEmit(child.stdout, 'data', invocation.stdout);
      }
      mockEmit(child, 'close', invocation.exitCode ?? 0);
      mockEmit(child, 'exit', invocation.exitCode ?? 0);

      return child;
    });
  }

  mock.mockImplementation((binary: string, _options: any) => {
    throw new Error(`Did not expect call of ${binary}`);
  });
}

/**
 * Must do this on the next tick, as emitter.emit() expects all listeners to have been attached already
 */
function mockEmit(emitter: events.EventEmitter, event: string, data: any) {
  setImmediate(() => {
    emitter.emit(event, data);
  });
}
