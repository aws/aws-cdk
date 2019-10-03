import { Test } from 'nodeunit';
import stepfunctions = require('../lib');

export = {
    'Condition variables must start with $. or $['(test: Test) {
        test.throws(() => {
            stepfunctions.Condition.stringEquals('a', 'b');
        });

        test.done();
    },
    'Condition variables can start with $.'(test: Test) {
        test.doesNotThrow(() => {
            stepfunctions.Condition.stringEquals('$.a', 'b');
        });

        test.done();
    },
    'Condition variables can start with $['(test: Test) {
        test.doesNotThrow(() => {
            stepfunctions.Condition.stringEquals('$[0]', 'a');
        });

        test.done();
    },
    'NotConditon must render properly'(test: Test) {
        assertRendersTo(test,
            stepfunctions.Condition.not(stepfunctions.Condition.stringEquals('$.a', 'b')),
            {Not: {Variable: '$.a', StringEquals: 'b'}}
        );

        test.done();
    },
    'CompoundCondition must render properly'(test: Test) {
        assertRendersTo(test,
            stepfunctions.Condition.and(
                stepfunctions.Condition.booleanEquals('$.a', true),
                stepfunctions.Condition.numberGreaterThan('$.b', 3)
            ),
            { And: [ { Variable: '$.a', BooleanEquals: true }, { Variable: '$.b', NumericGreaterThan: 3 } ] }
        );

        test.done();
    },
    'Exercise a number of other conditions'(test: Test) {
        const cases: Array<[stepfunctions.Condition, object]> = [
            [
                stepfunctions.Condition.stringLessThan('$.a', 'foo'),
                { Variable: '$.a', StringLessThan: 'foo' },
            ],
            [
                stepfunctions.Condition.stringLessThanEquals('$.a', 'foo'),
                { Variable: '$.a', StringLessThanEquals: 'foo' },
            ],
            [
                stepfunctions.Condition.stringGreaterThan('$.a', 'foo'),
                { Variable: '$.a', StringGreaterThan: 'foo' },
            ],
            [
                stepfunctions.Condition.stringGreaterThanEquals('$.a', 'foo'),
                { Variable: '$.a', StringGreaterThanEquals: 'foo' },
            ],
            [
                stepfunctions.Condition.numberEquals('$.a', 5),
                { Variable: '$.a', NumericEquals: 5 }
            ],
        ];

        for (const [cond, expected] of cases) {
            assertRendersTo(test, cond, expected);
        }

        test.done();
    },
};

function assertRendersTo(test: Test, cond: stepfunctions.Condition, expected: any) {
    test.deepEqual(cond.renderCondition(), expected);
}
