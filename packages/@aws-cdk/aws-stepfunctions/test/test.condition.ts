import { Test } from 'nodeunit';
import stepfunctions = require('../lib');

export = {
    'Condition variables must start with $.'(test: Test) {
        test.throws(() => {
            stepfunctions.Condition.stringEquals('a', 'b');
        });

        test.done();
    }
};
