import { render } from './private/render-util';
import * as cdk from '../../core';
import * as sfn from '../lib';

describe('Custom State', () => {
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

  test('maintains the state Json provided during construction', () => {
    // WHEN
    const customState = new sfn.CustomState(stack, 'Custom', {
      stateName: 'my-custom-state-name',
      stateJson,
    });

    // THEN
    expect(customState.toStateJson()).toStrictEqual({
      ...stateJson,
      End: true,
    });
  });

  test('can add a next state to the chain', () => {
    // WHEN
    const definition = new sfn.CustomState(stack, 'Custom', {
      stateName: 'my-custom-state-name',
      stateJson,
    }).next(new sfn.Pass(stack, 'MyPass'));

    // THEN
    expect(render(stack, definition)).toStrictEqual(
      {
        StartAt: 'my-custom-state-name',
        States: {
          'my-custom-state-name': {
            Next: 'MyPass',
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
          },
          'MyPass': {
            Type: 'Pass',
            End: true,
          },
        },
      },
    );
  });
});