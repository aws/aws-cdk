import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as stepfunctions from '../lib';

export = {
    'State Machine With Parallel State'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const parallel = new stepfunctions.Parallel(stack, 'Parallel State');
        parallel.branch(new stepfunctions.Pass(stack, 'Branch 1'));
        parallel.branch(new stepfunctions.Pass(stack, 'Branch 2'));

        // THEN
        test.deepEqual(render(parallel), {
            StartAt: 'Parallel State',
            States: {
                'Parallel State': {
                    Type: 'Parallel',
                    End: true,
                    Branches: [
                        { StartAt: 'Branch 1', States: { 'Branch 1': { Type: 'Pass', End: true } } },
                        { StartAt: 'Branch 2', States: { 'Branch 2': { Type: 'Pass', End: true } } }
                    ]
                }
            }
        });

        test.done();
    }
};

function render(sm: stepfunctions.IChainable) {
    return new cdk.Stack().resolve(new stepfunctions.StateGraph(sm.startState, 'Test Graph').toGraphJson());
}
