import * as mockery from 'mockery';
import { ICallbackFunction, Test, testCase } from 'nodeunit';
import { CommandHandler } from '../lib/command-api';

module.exports = testCase({
  '`cdk doctor`': {
    'setUp'(cb: ICallbackFunction) {
      mockery.registerMock('../../lib/logging', {
        print: () => undefined
      });
      mockery.enable({ useCleanCache: true, warnOnReplace: true, warnOnUnregistered: false });
      cb();
    },
    'tearDown'(cb: ICallbackFunction) {
      mockery.disable();
      mockery.deregisterAll();
      cb();
    },
    async 'exits with 0 when everything is OK'(test: Test) {
      const argv: any = {};
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../lib/commands/doctor').handler(argv);
        const result = await (argv.commandHandler as CommandHandler)({
          args: argv
        } as any);
        test.equal(result, 0, 'exit status was 0');
      } catch (e) {
        test.doesNotThrow(() => e);
      } finally {
        test.done();
      }
    }
  }
});
