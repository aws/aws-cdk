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
    }).next(new sfn.Pass(stack, 'MyPass', {
      stateName: 'my-pass-state',
    }));

    // THEN
    expect(render(stack, definition)).toStrictEqual(
      {
        StartAt: 'Custom',
        States: {
          'Custom': {
            Next: 'my-pass-state',
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
          'my-pass-state': {
            Type: 'Pass',
            End: true,
          },
        },
      },
    );
  });
});