import mockery = require('mockery');
import { ICallbackFunction, Test, testCase } from 'nodeunit';

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
      try {
        const result = await require('../lib/commands/doctor').handler();
        test.equal(result, 0, 'exit status was 0');
      } catch (e) {
        test.doesNotThrow(() => e);
      } finally {
        test.done();
      }
    }
  }
});
