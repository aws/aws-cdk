import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import stepfunctions = require('../lib');
import { isPositiveInteger } from '../lib';

export = {
    'State Machine With Map State'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const map = new stepfunctions.Map(stack, 'Map State', {
            maxConcurrency: 1,
            itemsPath: stepfunctions.Data.stringAt('$.inputForMap'),
            parameters: {
                foo: 'foo',
                bar: stepfunctions.Data.stringAt('$.bar')
            }
        });
        map.iterator(new stepfunctions.Pass(stack, 'Pass State'));

        // THEN
        test.deepEqual(render(map), {
            StartAt: 'Map State',
            States: {
                'Map State': {
                    Type: 'Map',
                    End: true,
                    Parameters: { foo: 'foo', bar: '$.bar' },
                    Iterator: {
                        StartAt: 'Pass State',
                        States: {
                            'Pass State': {
                                Type: 'Pass',
                                End: true
                            }
                        }
                    },
                    ItemsPath: '$.inputForMap',
                    MaxConcurrency: 1
                }
            }
        });

        test.done();
    },
    'synth is successful'(test: Test) {

        const app = createAppWithMap((stack) => {
            const map = new stepfunctions.Map(stack, 'Map State', {
                maxConcurrency: 1,
                itemsPath: stepfunctions.Data.stringAt('$.inputForMap')
            });
            map.iterator(new stepfunctions.Pass(stack, 'Pass State'));
            return map;
        });

        app.synth();
        test.done();
    },
    'fails in synthesis if iterator is missing'(test: Test) {

        const app = createAppWithMap((stack) => {
            const map = new stepfunctions.Map(stack, 'Map State', {
                maxConcurrency: 1,
                itemsPath: stepfunctions.Data.stringAt('$.inputForMap')
            });

            return map;
        });

        test.throws(() => {
            app.synth();
        }, /Map state must have a non-empty iterator/, 'A validation was expected');

        test.done();
    },
    'fails in synthesis when maxConcurrency is a float'(test: Test) {

        const app = createAppWithMap((stack) => {
            const map = new stepfunctions.Map(stack, 'Map State', {
                maxConcurrency: 1.2,
                itemsPath: stepfunctions.Data.stringAt('$.inputForMap')
            });
            map.iterator(new stepfunctions.Pass(stack, 'Pass State'));

            return map;
        });

        test.throws(() => {
            app.synth();
        }, /maxConcurrency has to be a positive integer/, 'A validation was expected');

        test.done();

    },
    'fails in synthesis when maxConcurrency is a negative integer'(test: Test) {

        const app = createAppWithMap((stack) => {
            const map = new stepfunctions.Map(stack, 'Map State', {
                maxConcurrency: -1,
                itemsPath: stepfunctions.Data.stringAt('$.inputForMap')
            });
            map.iterator(new stepfunctions.Pass(stack, 'Pass State'));

            return map;
        });

        test.throws(() => {
            app.synth();
        }, /maxConcurrency has to be a positive integer/, 'A validation was expected');

        test.done();
    },
    'fails in synthesis when maxConcurrency is too big to be an integer'(test: Test) {

        const app = createAppWithMap((stack) => {
            const map = new stepfunctions.Map(stack, 'Map State', {
                maxConcurrency: Number.MAX_VALUE,
                itemsPath: stepfunctions.Data.stringAt('$.inputForMap')
            });
            map.iterator(new stepfunctions.Pass(stack, 'Pass State'));

            return map;
        });

        test.throws(() => {
            app.synth();
        }, /maxConcurrency has to be a positive integer/, 'A validation was expected');

        test.done();

    },
    'isPositiveInteger is false with negative number'(test: Test) {
        test.equals(isPositiveInteger(-1), false, '-1 is not a valid positive integer');
    },
    'isPositiveInteger is false with decimal number'(test: Test) {
        test.equals(isPositiveInteger(1.2), false, '1.2 is not a valid positive integer');
    },
    'isPositiveInteger is false with a value greater than safe integer '(test: Test) {
        const valueToTest = Number.MAX_SAFE_INTEGER + 1;
        test.equals(isPositiveInteger(valueToTest), false, `${valueToTest} is not a valid positive integer`);
    },
    'isPositiveInteger is true with 0'(test: Test) {
        test.equals(isPositiveInteger(0), true, '0 is expected to be a positive integer');
    },
    'isPositiveInteger is true with 10'(test: Test) {
        test.equals(isPositiveInteger(10), true, '10 is expected to be a positive integer');
    },
    'isPositiveInteger is true with max integer value'(test: Test) {
        test.equals(isPositiveInteger(Number.MAX_SAFE_INTEGER), true, `${Number.MAX_SAFE_INTEGER} is expected to be a positive integer`);
    }
};

function render(sm: stepfunctions.IChainable) {
    return new cdk.Stack().resolve(new stepfunctions.StateGraph(sm.startState, 'Test Graph').toGraphJson());
}

function createAppWithMap(mapFactory: (stack: cdk.Stack) => stepfunctions.Map) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    const map = mapFactory(stack);
    new stepfunctions.StateGraph(map, 'Test Graph');
    return app;
}
