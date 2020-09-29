import * as mockery from 'mockery';
import { CommandHandler } from '../lib/command-api';

const argv = {
  browser: 'echo %u',
  commandHandler: undefined as (CommandHandler | undefined),
};

describe('`cdk docs`', () => {
  beforeEach(done => {
    mockery.registerMock('../../lib/logging', {
      debug() { return; },
      error() { return; },
      print() { return; },
      warning() { return; },
    });
    mockery.enable({ useCleanCache: true, warnOnReplace: true, warnOnUnregistered: false });
    done();
  });

  afterAll(done => {
    mockery.disable();
    mockery.deregisterAll();
    done();
  });

  test('exits with 0 when everything is OK', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../lib/commands/docs').handler(argv);
    const result = await argv.commandHandler!({ args: argv } as any);
    expect(result).toBe(0);
  });

  test('exits with 0 when opening the browser fails', async () => {
    mockery.registerMock('child_process', {
      exec(_: string, cb: (err: Error, stdout?: string, stderr?: string) => void) {
        cb(new Error('TEST'));
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../lib/commands/docs').handler(argv);
    const result = await argv.commandHandler!({ args: argv } as any);
    expect(result).toBe(0);
  });
});
