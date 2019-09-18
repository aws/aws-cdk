import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import stepfunctions = require('../lib');

export = {
    'State Machine With Map State'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const map = new stepfunctions.Map(stack, 'Map State', {
            sequential: true,
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
    }
};

function render(sm: stepfunctions.IChainable) {
    return new cdk.Stack().resolve(new stepfunctions.StateGraph(sm.startState, 'Test Graph').toGraphJson());
}
