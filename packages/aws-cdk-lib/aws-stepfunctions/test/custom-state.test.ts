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
      ...{ Catch: undefined, Retry: undefined },
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

  test('can add a catch state', () => {
    // GIVEN
    const failure = new sfn.Fail(stack, 'failed', {
      error: 'DidNotWork',
      cause: 'We got stuck',
    });
    const custom = new sfn.CustomState(stack, 'Custom', {
      stateJson,
    });
    const chain = sfn.Chain.start(custom);

    // WHEN
    custom.addCatch(failure);

    // THEN
    expect(render(stack, chain)).toStrictEqual(
      {
        StartAt: 'Custom',
        States: {
          Custom: {
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
            Catch: [{
              ErrorEquals: ['States.ALL'],
              Next: 'failed',
            }],
            End: true,
          },
          failed: {
            Type: 'Fail',
            Error: 'DidNotWork',
            Cause: 'We got stuck',
          },
        },
      },
    );
  });

  test('can add a retry state', () => {
    // GIVEN
    const custom = new sfn.CustomState(stack, 'Custom', {
      stateJson,
    });
    const chain = sfn.Chain.start(custom);

    // WHEN
    custom.addRetry({
      errors: ['States.ALL'],
      interval: cdk.Duration.seconds(10),
      maxAttempts: 5,
    });

    // THEN
    expect(render(stack, chain)).toStrictEqual(
      {
        StartAt: 'Custom',
        States: {
          Custom: {
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
            Retry: [{
              ErrorEquals: ['States.ALL'],
              IntervalSeconds: 10,
              MaxAttempts: 5,
            }],
            End: true,
          },
        },
      },
    );
  });
});