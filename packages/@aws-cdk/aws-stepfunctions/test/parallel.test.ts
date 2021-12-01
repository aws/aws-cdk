import * as cdk from '@aws-cdk/core';
import * as stepfunctions from '../lib';
import { State } from '../lib';

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

  test('State Machine With Parallel State and ResultSelector', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const parallel = new stepfunctions.Parallel(stack, 'Parallel State', {
      resultSelector: {
        buz: 'buz',
        baz: stepfunctions.JsonPath.stringAt('$.baz'),
      },
    });
    parallel.branch(new stepfunctions.Pass(stack, 'Branch 1'));

    // THEN
    expect(render(parallel)).toStrictEqual({
      StartAt: 'Parallel State',
      States: {
        'Parallel State': {
          Type: 'Parallel',
          End: true,
          Branches: [
            { StartAt: 'Branch 1', States: { 'Branch 1': { Type: 'Pass', End: true } } },
          ],
          ResultSelector: {
            'buz': 'buz',
            'baz.$': '$.baz',
          },
        },
      },
    });
  });

  test('Prefix is bound to all branches', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const parallel = new stepfunctions.Parallel(stack, 'Parallel State');
    parallel.branch(new stepfunctions.Pass(stack, 'Branch 1'));
    parallel.branch(new stepfunctions.Pass(stack, 'Branch 2'));
    State.prefixStates(parallel, 'Prefix ');

    // THEN
    expect(render(parallel)).toStrictEqual({
      StartAt: 'Prefix Parallel State',
      States: {
        'Prefix Parallel State': {
          Type: 'Parallel',
          End: true,
          Branches: [
            { StartAt: 'Prefix Branch 1', States: { 'Prefix Branch 1': { Type: 'Pass', End: true } } },
            { StartAt: 'Prefix Branch 2', States: { 'Prefix Branch 2': { Type: 'Pass', End: true } } },
          ],
        },
      },
    });
  });
});

function render(sm: stepfunctions.IChainable) {
  return new cdk.Stack().resolve(new stepfunctions.StateGraph(sm.startState, 'Test Graph').toGraphJson());
}
