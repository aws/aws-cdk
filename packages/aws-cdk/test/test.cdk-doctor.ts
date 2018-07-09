import * as mockery from 'mockery';
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
            mockery.registerMock('aws-cdk-docs/package.json', { version: 'x.y.z' });

            try {
                const result = await require('../lib/commands/doctor').handler();
                test.equal(result, 0, 'exit status was 0');
            } catch (e) {
                test.doesNotThrow(() => e);
            } finally {
                test.done();
            }
        },
        async 'exits with non-0 when documentation is missing'(test: Test) {
            try {
                const result = await require('../lib/commands/doctor').handler();
                test.notEqual(result, 0, 'exit status was non-0');
            } catch (e) {
                test.doesNotThrow(() => e);
            } finally {
                test.done();
            }
        }
    }
});
