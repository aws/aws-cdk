import * as mockery from 'mockery';
import { CommandHandler } from '../lib/command-api';

describe('`cdk doctor`', () => {
  beforeEach(done => {
    mockery.registerMock('../../lib/logging', {
      print: () => undefined,
    });
    mockery.enable({ useCleanCache: true, warnOnReplace: true, warnOnUnregistered: false });
    done();
  });

  afterEach(done => {
    mockery.disable();
    mockery.deregisterAll();
    done();
  });

  test('exits with 0 when everything is OK', async () => {
    const argv: any = {};
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../lib/commands/doctor').handler(argv);
    const result = await (argv.commandHandler as CommandHandler)({ args: argv } as any);
    expect(result).toBe(0);
  });
});
