import { render } from './private/render-util';
import * as cdk from '../../core';
import * as stepfunctions from '../lib';

describe('Fail State', () => {
  let stack: cdk.Stack;
  let stateJson: any;

  beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
    stateJson = {
      Type: 'Task',
      Resource: 'arn:aws:states:::dynamodb:putItem',
      Parameters: {
        TableName: 'MyTable',
        Item: {
          id: {
            S: 'MyEntry',
          },
        },
      },
      ResultPath: null,
    };
  });

  test('Props are optional', () => {
    new stepfunctions.Fail(stack, 'Fail');
  });

  test('can add a fail state to the chain with custom state name', () => {
  // WHEN
    const definition = new stepfunctions.CustomState(stack, 'Custom1', {
      stateJson,
    }).next(new stepfunctions.Pass(stack, 'MyPass'))
      .next(new stepfunctions.Fail(stack, 'Fail', {
        stateName: 'my-fail-state',
        comment: 'failing state',
        errorPath: stepfunctions.JsonPath.stringAt('$.error'),
        causePath: stepfunctions.JsonPath.stringAt('$.cause'),
      }));

    // THEN
    expect(render(stack, definition)).toStrictEqual(
      {
        StartAt: 'Custom1',
        States: {
          'Custom1': {
            Next: 'MyPass',
            Type: 'Task',
            ...stateJson,
          },
          'MyPass': {
            Type: 'Pass',
            Next: 'my-fail-state',
          },
          'my-fail-state': {
            Comment: 'failing state',
            Type: 'Fail',
            CausePath: '$.cause',
            ErrorPath: '$.error',
          },
        },
      },
    );
  });
});
