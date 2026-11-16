import * as cdk from '../../core';
import * as stepfunctions from '../lib';

describe('Parallel State', () => {
  test('State Machine With Parallel State', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const parallel = new stepfunctions.Parallel(stack, 'Parallel State');
    parallel.branch(new stepfunctions.Pass(stack, 'Branch 1', { stateName: 'first-pass-state' }));
    parallel.branch(new stepfunctions.Pass(stack, 'Branch 2'));

    // THEN
    expect(render(parallel)).toStrictEqual({
      StartAt: 'Parallel State',
      States: {
        'Parallel State': {
          Type: 'Parallel',
          End: true,
          Branches: [
            { StartAt: 'first-pass-state', States: { 'first-pass-state': { Type: 'Pass', End: true } } },
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

  test('State Machine With Parallel State With Parameters', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const parallel = new stepfunctions.Parallel(stack, 'Parallel State', {
      parameters: {
        staticString: 'Static Value',
        staticNumber: 123,
        dynamicValue: stepfunctions.JsonPath.stringAt('$.inputField'),
        executionName: stepfunctions.JsonPath.executionName,
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
          Parameters: {
            'staticString': 'Static Value',
            'staticNumber': 123,
            'dynamicValue.$': '$.inputField',
            'executionName.$': '$$.Execution.Name',
          },
        },
      },
    });
  });

  test('State Machine With Parallel State using JSONata', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const parallel = stepfunctions.Parallel.jsonata(stack, 'Parallel State', {
      outputs: {
        foo: '{% $state.input.result[0] %}',
      },
    });
    parallel.branch(stepfunctions.Pass.jsonPath(stack, 'Branch 1', { stateName: 'first-pass-state' }));
    parallel.branch(stepfunctions.Pass.jsonPath(stack, 'Branch 2'));

    // THEN
    expect(render(parallel)).toStrictEqual({
      StartAt: 'Parallel State',
      States: {
        'Parallel State': {
          Type: 'Parallel',
          QueryLanguage: 'JSONata',
          End: true,
          Branches: [
            { StartAt: 'first-pass-state', States: { 'first-pass-state': { Type: 'Pass', End: true } } },
            { StartAt: 'Branch 2', States: { 'Branch 2': { Type: 'Pass', End: true } } },
          ],
          Output: {
            foo: '{% $state.input.result[0] %}',
          },
        },
      },
    });
  });

  test('Parallel inherits JSONata queryLanguage and preserves Catch Output', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const wrapped = stepfunctions.Chain.start(new stepfunctions.Fail(stack, 'Failure'))
      .toSingleState('Wrapped');

    wrapped.addCatch(new stepfunctions.Succeed(stack, 'Handled'), {
      outputs: { error: '{% $states.errorOutput.Error %}' },
    });

    // THEN
    expect(render(wrapped, stepfunctions.QueryLanguage.JSONATA)).toStrictEqual({
      StartAt: 'Wrapped',
      States: {
        Wrapped: {
          Type: 'Parallel',
          End: true,
          Catch: [
            {
              ErrorEquals: ['States.ALL'],
              Next: 'Handled',
              Output: {
                error: '{% $states.errorOutput.Error %}',
              },
            },
          ],
          Branches: [
            {
              StartAt: 'Failure',
              States: {
                Failure: {
                  Type: 'Fail',
                },
              },
            },
          ],
        },
        Handled: {
          Type: 'Succeed',
        },
      },
    });
  });

  test('Parallel branches forward inherited JSONata to child states preserving Choice outputs', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const parallel = new stepfunctions.Parallel(stack, 'Parallel State');

    const choice = new stepfunctions.Choice(stack, 'Inner Choice')
      .when(stepfunctions.Condition.jsonata('{% $x > 1 %}'), new stepfunctions.Pass(stack, 'Inner Pass'), {
        outputs: { result: '{% $states.input.value %}' },
      });

    parallel.branch(choice);

    // THEN
    expect(render(parallel, stepfunctions.QueryLanguage.JSONATA)).toStrictEqual({
      StartAt: 'Parallel State',
      States: {
        'Parallel State': {
          Type: 'Parallel',
          End: true,
          Branches: [
            {
              StartAt: 'Inner Choice',
              States: {
                'Inner Choice': {
                  Type: 'Choice',
                  Choices: [
                    {
                      Condition: '{% $x > 1 %}',
                      Next: 'Inner Pass',
                      Output: {
                        result: '{% $states.input.value %}',
                      },
                    },
                  ],
                },
                'Inner Pass': {
                  Type: 'Pass',
                  End: true,
                },
              },
            },
          ],
        },
      },
    });
  });
});

function render(sm: stepfunctions.IChainable, queryLanguage?: stepfunctions.QueryLanguage) {
  return new cdk.Stack().resolve(new stepfunctions.StateGraph(sm.startState, 'Test Graph').toGraphJson(queryLanguage));
}
