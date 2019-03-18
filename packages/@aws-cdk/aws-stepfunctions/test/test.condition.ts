import { Test } from 'nodeunit';
import stepfunctions = require('../lib');

export = {
    'Condition variables must start with $.'(test: Test) {
        test.throws(() => {
            stepfunctions.Condition.stringEquals('a', 'b');
        });

        test.done();
    },
    'NotConditon must render properly'(test: Test) {
        // GIVEN
        const condition = stepfunctions.Condition.not(stepfunctions.Condition.stringEquals('$.a', 'b'));

        // WHEN
        const render = condition.renderCondition();

        // THEN
        test.deepEqual(render, {Not: {Variable: '$.a', StringEquals: 'b'}});

        test.done();
    },
};
