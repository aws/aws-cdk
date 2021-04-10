import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as stepfunctions from '../lib';

describe('Parallel State', () => {
  test('State Machine With Parallel State', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const parallel = new stepfunctions.Parallel(stack, 'Parallel State');
    parallel.branch(new stepfunctions.Pass(stack, 'Branch 1'));
    parallel.branch(new stepfunctions.Pass(stack, 'Branch 2'));

    // THEN
    expect(render(parallel)).toStrictEqual({
      StartAt: 'Parallel State',
      States: {
        'Parallel State': {
          Type: 'Parallel',
          End: true,
          Branches: [
            { StartAt: 'Branch 1', States: { 'Branch 1': { Type: 'Pass', End: true } } },
            { StartAt: 'Branch 2', States: { 'Branch 2': { Type: 'Pass', End: true } } },
          ],
        },
      },
    });
  });
});

function render(sm: stepfunctions.IChainable) {
  return new cdk.Stack().resolve(new stepfunctions.StateGraph(sm.startState, 'Test Graph').toGraphJson());
}
