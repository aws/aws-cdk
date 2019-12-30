import * as mockery from 'mockery';
import { ICallbackFunction, Test, testCase } from 'nodeunit';
import { CommandHandler } from '../lib/command-api';

const argv = {
  browser: 'echo %u',
  commandHandler: undefined as (CommandHandler | undefined),
};

module.exports = testCase({
  '`cdk docs`': {
    'setUp'(cb: ICallbackFunction) {
      mockery.registerMock('../../lib/logging', {
        debug() { return; },
        error() { return; },
        print() { return; },
        warning() { return; }
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
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../lib/commands/docs').handler(argv);
        const result = await argv.commandHandler!({
          args: argv
        } as any);
        test.equal(result, 0, 'exit status was 0');
      } catch (e) {
        test.doesNotThrow(() => { throw e; });
      } finally {
        test.done();
      }
    },
    async 'exits with 0 when opening the browser fails'(test: Test) {
      mockery.registerMock('child_process', {
        exec(_: string, cb: (err: Error, stdout?: string, stderr?: string) => void) {
          cb(new Error('TEST'));
        }
      });
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../lib/commands/docs').handler(argv);
        const result = await argv.commandHandler!({
          args: argv
        } as any);
        test.equal(result, 0, 'exit status was 0');
      } catch (e) {
        test.doesNotThrow(() => { throw e; });
      } finally {
        test.done();
      }
    }
  }
});
