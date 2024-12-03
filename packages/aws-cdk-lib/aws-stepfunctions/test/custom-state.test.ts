import { render } from './private/render-util';
import { Annotations, Match } from '../../assertions';
import * as cdk from '../../core';
import * as sfn from '../lib';
import { Errors } from '../lib/types';

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
      errors: [sfn.Errors.ALL],
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

  test('respect the Retry field in the stateJson', () => {
    // GIVEN
    const custom = new sfn.CustomState(stack, 'Custom', {
      stateJson: {
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
        Retry: [
          {
            ErrorEquals: [sfn.Errors.TIMEOUT],
            IntervalSeconds: 20,
            MaxAttempts: 2,
          },
          {
            ErrorEquals: [sfn.Errors.RESULT_PATH_MATCH_FAILURE],
            IntervalSeconds: 20,
            MaxAttempts: 2,
          },
        ],
      },
    });
    const chain = sfn.Chain.start(custom);

    // WHEN
    custom.addRetry({
      errors: [sfn.Errors.PERMISSIONS],
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
            Retry: [
              {
                ErrorEquals: ['States.Permissions'],
                IntervalSeconds: 10,
                MaxAttempts: 5,
              },
              {
                ErrorEquals: ['States.Timeout'],
                IntervalSeconds: 20,
                MaxAttempts: 2,
              },
              {
                ErrorEquals: ['States.ResultPathMatchFailure'],
                IntervalSeconds: 20,
                MaxAttempts: 2,
              },
            ],
            End: true,
          },
        },
      },
    );
  });

  test('expect retry to not fail when specifying strategy inline', () => {
    // GIVEN
    const custom = new sfn.CustomState(stack, 'Custom', {
      stateJson: {
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
        Retry: [
          {
            ErrorEquals: [
              'Lambda.ServiceException',
              'Lambda.AWSLambdaException',
              'Lambda.SdkClientException',
              'Lambda.TooManyRequestsException',
            ],
            IntervalSeconds: 20,
            MaxAttempts: 2,
          },
        ],
      },
    });
    const chain = sfn.Chain.start(custom);

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
            Retry: [
              {
                ErrorEquals: [
                  'Lambda.ServiceException',
                  'Lambda.AWSLambdaException',
                  'Lambda.SdkClientException',
                  'Lambda.TooManyRequestsException',
                ],
                IntervalSeconds: 20,
                MaxAttempts: 2,
              },
            ],
            End: true,
          },
        },
      },
    );
  });

  test('expect retry to merge when specifying strategy inline and through construct', () => {
    // GIVEN
    const custom = new sfn.CustomState(stack, 'Custom', {
      stateJson: {
        ...stateJson,
        Retry: [{
          ErrorEquals: ['States.TaskFailed'],
        }],
      },
    }).addRetry({ errors: [Errors.TIMEOUT] });
    const chain = sfn.Chain.start(custom);

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
            Retry: [
              {
                ErrorEquals: ['States.Timeout'],
              },
              {
                ErrorEquals: ['States.TaskFailed'],
              },
            ],
            End: true,
          },
        },
      },
    );
  });

  test('expect catch to not fail when specifying strategy inline', () => {
    // GIVEN
    const custom = new sfn.CustomState(stack, 'Custom', {
      stateJson: {
        ...stateJson,
        Catch: [{
          ErrorEquals: ['States.TaskFailed'],
          Next: 'Failed',
        }],
      },
    });
    const chain = sfn.Chain.start(custom);

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
              ErrorEquals: ['States.TaskFailed'],
              Next: 'Failed',
            }],
            End: true,
          },
        },
      },
    );
  });

  test('expect catch to merge when specifying strategy inline and through construct', () => {
    // GIVEN
    const failure = new sfn.Fail(stack, 'Failed', {
      error: 'DidNotWork',
      cause: 'We got stuck',
    });

    const custom = new sfn.CustomState(stack, 'Custom', {
      stateJson: {
        ...stateJson,
        Catch: [{
          ErrorEquals: ['States.TaskFailed'],
          Next: 'Failed',
        }],
      },
    }).addCatch(failure, { errors: [Errors.TIMEOUT] });
    const chain = sfn.Chain.start(custom);

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
            Catch: [
              {
                ErrorEquals: ['States.Timeout'],
                Next: 'Failed',
              }, {
                ErrorEquals: ['States.TaskFailed'],
                Next: 'Failed',
              },
            ],
            End: true,
          },
          Failed: {
            Type: 'Fail',
            Error: 'DidNotWork',
            Cause: 'We got stuck',
          },
        },
      },
    );
  });

  test('expect warning message to be emitted when retries specified both in stateJson and through addRetry()', () => {
    const customState = new sfn.CustomState(stack, 'my custom task', {
      stateJson: {
        Type: 'Task',
        Resource: 'arn:aws:states:::dynamodb:putItem',
        Parameters: {
          TableName: 'my-cool-table',
          Item: {
            id: {
              S: 'my-entry',
            },
          },
        },
        Retry: [{
          ErrorEquals: ['States.TaskFailed'],
        }],
      },
    });

    customState.addRetry({
      errors: [sfn.Errors.TIMEOUT],
      interval: cdk.Duration.seconds(10),
      maxAttempts: 5,
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definition: sfn.Chain.start(customState),
      timeout: cdk.Duration.seconds(30),
    });

    Annotations.fromStack(stack).hasWarning('/Default/my custom task', Match.stringLikeRegexp('CustomState constructs can configure state retries'));
  });

  test('expect warning message to be emitted when catchers specified both in stateJson and through addCatch()', () => {
    const customState = new sfn.CustomState(stack, 'my custom task', {
      stateJson: {
        Type: 'Task',
        Resource: 'arn:aws:states:::dynamodb:putItem',
        Parameters: {
          TableName: 'my-cool-table',
          Item: {
            id: {
              S: 'my-entry',
            },
          },
        },
        Catch: [
          {
            ErrorEquals: ['States.Timeout'],
            Next: 'Failed',
          },
        ],
      },
    });

    const failure = new sfn.Fail(stack, 'Failed', {
      error: 'DidNotWork',
      cause: 'We got stuck',
    });

    customState.addCatch(failure, { errors: [Errors.TIMEOUT] });

    new sfn.StateMachine(stack, 'StateMachine', {
      definition: sfn.Chain.start(customState),
      timeout: cdk.Duration.seconds(30),
    });

    Annotations.fromStack(stack).hasWarning('/Default/my custom task', Match.stringLikeRegexp('CustomState constructs can configure state catchers'));
  });
});
