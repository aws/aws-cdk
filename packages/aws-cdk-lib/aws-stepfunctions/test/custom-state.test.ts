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

  test('can add a catch state to thechain'), () => {
    // WHEN
    const fail = new sfn.Fail(stack, 'MyFail', { error: 'DidNotWork', cause: 'HumanError' })
    const definition = new sfn.CustomState(stack, 'Custom', {
        stateJson,
      }).addCatch(fail);
  
    // THEN
    expect(render(stack, definition)).toStrictEqual(
    {
        StartAt: 'Custom',
        States: {
        'Custom': {
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
            Catch: {
                
            }
        },
        'my-pass-state': {
            Type: 'Pass',
            End: true,
        },
        },
    },
    );
  };
});