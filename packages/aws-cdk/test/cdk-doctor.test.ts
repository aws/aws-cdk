import * as mockery from 'mockery';
import { realHandler } from '../lib/commands/doctor';

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
    const result = await realHandler({ args: argv } as any);
    expect(result).toBe(0);
  });
});
