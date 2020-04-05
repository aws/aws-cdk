import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, Stack } from '@aws-cdk/core';
import * as path from 'path';
import * as cr from '../../lib';
import * as util from '../../lib/provider-framework/util';

import '@aws-cdk/assert/jest';

test('minimal setup', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new cr.Provider(stack, 'MyProvider', {
    onEventHandler: new lambda.Function(stack, 'MyHandler', {
      code: lambda.Code.fromAsset(path.join(__dirname, './integration-test-fixtures/s3-file-handler')),
      handler: 'index.onEvent',
      runtime: lambda.Runtime.NODEJS_10_X
    }),
  });

  // THEN

  // framework "onEvent" handler
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'framework.onEvent',
    Environment: { Variables: { USER_ON_EVENT_FUNCTION_ARN: { 'Fn::GetAtt': [ 'MyHandler6B74D312', 'Arn' ] } } },
    Timeout: 900
  });

  // user "onEvent" handler
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'index.onEvent',
  });

  // no framework "is complete" handler or state machine
  expect(stack).not.toHaveResource('AWS::StepFunctions::StateMachine');
  expect(stack).not.toHaveResource('AWS::Lambda::Function', {
    Handler: 'framework.isComplete',
    Timeout: 900
  });
});

test('if isComplete is specified, the isComplete framework handler is also included', () => {
  // GIVEN
  const stack = new Stack();
  const handler = new lambda.Function(stack, 'MyHandler', {
    code: lambda.Code.fromAsset(path.join(__dirname, './integration-test-fixtures/s3-file-handler')),
    handler: 'index.onEvent',
    runtime: lambda.Runtime.NODEJS_10_X
  });

  // WHEN
  new cr.Provider(stack, 'MyProvider', {
    onEventHandler: handler,
    isCompleteHandler: handler
  });

  // THEN

  // framework "onEvent" handler
  const expectedEnv = {
    Variables: {
      USER_ON_EVENT_FUNCTION_ARN: { 'Fn::GetAtt': ['MyHandler6B74D312', 'Arn' ] },
      USER_IS_COMPLETE_FUNCTION_ARN: { 'Fn::GetAtt': [ 'MyHandler6B74D312', 'Arn' ] }
    }
  };

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'framework.onEvent',
    Timeout: 900,
    Environment: {
      Variables: {
        ...expectedEnv.Variables,
        WAITER_STATE_MACHINE_ARN: { Ref: 'MyProviderwaiterstatemachineC1FBB9F9' }
      }
    }
  });

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'framework.isComplete',
    Timeout: 900,
    Environment: expectedEnv
  });

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: 'framework.onTimeout',
    Timeout: 900,
    Environment: expectedEnv
  });

  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': [
        '',
        [
          '{"StartAt":"framework-isComplete-task","States":{"framework-isComplete-task":{"End":true,"Retry":[{"ErrorEquals":["States.ALL"],"IntervalSeconds":5,"MaxAttempts":360,"BackoffRate":1}],"Catch":[{"ErrorEquals":["States.ALL"],"Next":"framework-onTimeout-task"}],"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [
              'MyProviderframeworkisComplete364190E2',
              'Arn'
            ]
          },
          '"},"framework-onTimeout-task":{"End":true,"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [
              'MyProviderframeworkonTimeoutD9D96588',
              'Arn'
            ]
          },
          '"}}}'
        ]
      ]
    }
  });
});

test('fails if "queryInterval" and/or "totalTimeout" are set without "isCompleteHandler"', () => {
  // GIVEN
  const stack = new Stack();
  const handler = new lambda.Function(stack, 'MyHandler', {
    code: lambda.Code.fromAsset(path.join(__dirname, './integration-test-fixtures/s3-file-handler')),
    handler: 'index.onEvent',
    runtime: lambda.Runtime.NODEJS_10_X
  });

  // THEN
  expect(() => new cr.Provider(stack, 'provider1', {
    onEventHandler: handler,
    queryInterval: Duration.seconds(10)
  })).toThrow(/\"queryInterval\" and \"totalTimeout\" can only be configured if \"isCompleteHandler\" is specified. Otherwise, they have no meaning/);

  expect(() => new cr.Provider(stack, 'provider2', {
    onEventHandler: handler,
    totalTimeout: Duration.seconds(100)
  })).toThrow(/\"queryInterval\" and \"totalTimeout\" can only be configured if \"isCompleteHandler\" is specified. Otherwise, they have no meaning/);
});

describe('retry policy', () => {
  it('default is 30 minutes timeout in 5 second intervals', () => {
    const policy = util.calculateRetryPolicy();
    expect(policy.backoffRate).toStrictEqual(1);
    expect(policy.interval && policy.interval.toSeconds()).toStrictEqual(5);
    expect(policy.maxAttempts).toStrictEqual(360);
  });

  it('if total timeout and query interval are the same we will have one attempt', () => {
    const policy = util.calculateRetryPolicy({
      totalTimeout: Duration.minutes(5),
      queryInterval: Duration.minutes(5)
    });
    expect(policy.maxAttempts).toStrictEqual(1);
  });

  it('fails if total timeout cannot be integrally divided', () => {
    expect(() => util.calculateRetryPolicy({
      totalTimeout: Duration.seconds(100),
      queryInterval: Duration.seconds(75)
    })).toThrow(/Cannot determine retry count since totalTimeout=100s is not integrally dividable by queryInterval=75s/);
  });

  it('fails if interval > timeout', () => {
    expect(() => util.calculateRetryPolicy({
      totalTimeout: Duration.seconds(5),
      queryInterval: Duration.seconds(10)
    })).toThrow(/Cannot determine retry count since totalTimeout=5s is not integrally dividable by queryInterval=10s/);
  });
});
