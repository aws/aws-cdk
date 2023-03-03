import * as cdk from '@aws-cdk/core';
import { render } from './private/render-util';
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
      stateJson,
    }).next(new sfn.Pass(stack, 'MyPass'));

    // THEN
    expect(render(stack, definition)).toStrictEqual(
      {
        StartAt: 'Custom',
        States: {
          Custom: {
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
          MyPass: {
            Type: 'Pass',
            End: true,
          },
        },
      },
    );
  });
});