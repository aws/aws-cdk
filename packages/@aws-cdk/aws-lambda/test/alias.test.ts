import '@aws-cdk/assert/jest';
import { arrayWith, objectLike } from '@aws-cdk/assert';
import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Lazy, Stack } from '@aws-cdk/core';
import * as lambda from '../lib';

describe('alias', () => {
  test('version and aliases', () => {
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1');

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
    });

    expect(stack).toHaveResource('AWS::Lambda::Version', {
      FunctionName: { Ref: 'MyLambdaCCE802FB' },
    });

    expect(stack).toHaveResource('AWS::Lambda::Alias', {
      FunctionName: { Ref: 'MyLambdaCCE802FB' },
      FunctionVersion: stack.resolve(version.version),
      Name: 'prod',
    });
  });

  test('can create an alias to $LATEST', () => {
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'latest',
      version: fn.latestVersion,
    });

    expect(stack).toHaveResource('AWS::Lambda::Alias', {
      FunctionName: { Ref: 'MyLambdaCCE802FB' },
      FunctionVersion: '$LATEST',
      Name: 'latest',
    });
    expect(stack).not.toHaveResource('AWS::Lambda::Version');
  });

  test('can use newVersion to create a new Version', () => {
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('NewVersion');

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
    });

    expect(stack).toHaveResourceLike('AWS::Lambda::Version', {
      FunctionName: { Ref: 'MyLambdaCCE802FB' },
    });

    expect(stack).toHaveResourceLike('AWS::Lambda::Alias', {
      FunctionName: { Ref: 'MyLambdaCCE802FB' },
      Name: 'prod',
    });
  });

  test('can add additional versions to alias', () => {
    const stack = new Stack();

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version1 = fn.addVersion('1');
    const version2 = fn.addVersion('2');

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: version1,
      additionalVersions: [{ version: version2, weight: 0.1 }],
    });

    expect(stack).toHaveResource('AWS::Lambda::Alias', {
      FunctionVersion: stack.resolve(version1.version),
      RoutingConfig: {
        AdditionalVersionWeights: [
          {
            FunctionVersion: stack.resolve(version2.version),
            FunctionWeight: 0.1,
          },
        ],
      },
    });
  });

  test('version and aliases with provisioned execution', () => {
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const pce = 5;
    const version = fn.addVersion('1', undefined, 'testing', pce);

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
      provisionedConcurrentExecutions: pce,
    });

    expect(stack).toHaveResource('AWS::Lambda::Version', {
      ProvisionedConcurrencyConfig: {
        ProvisionedConcurrentExecutions: 5,
      },
    });

    expect(stack).toHaveResource('AWS::Lambda::Alias', {
      FunctionVersion: stack.resolve(version.version),
      Name: 'prod',
      ProvisionedConcurrencyConfig: {
        ProvisionedConcurrentExecutions: 5,
      },
    });
  });

  test('sanity checks on version weights', () => {
    const stack = new Stack();

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1');

    // WHEN: Individual weight too high
    expect(() => {
      new lambda.Alias(stack, 'Alias1', {
        aliasName: 'prod',
        version,
        additionalVersions: [{ version, weight: 5 }],
      });
    }).toThrow();

    // WHEN: Sum too high
    expect(() => {
      new lambda.Alias(stack, 'Alias2', {
        aliasName: 'prod',
        version,
        additionalVersions: [{ version, weight: 0.5 }, { version, weight: 0.6 }],
      });
    }).toThrow();
  });

  test('metric adds Resource: aliasArn to dimensions', () => {
    const stack = new Stack();

    // GIVEN
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1');
    const alias = new lambda.Alias(stack, 'Alias', { aliasName: 'prod', version });

    // WHEN
    new cloudwatch.Alarm(stack, 'Alarm', {
      metric: alias.metric('Test'),
      alarmName: 'Test',
      threshold: 1,
      evaluationPeriods: 1,
    });

    // THEN
    expect(stack).toHaveResource('AWS::CloudWatch::Alarm', {
      Dimensions: [{
        Name: 'FunctionName',
        Value: {
          Ref: 'MyLambdaCCE802FB',
        },
      }, {
        Name: 'Resource',
        Value: {
          'Fn::Join': [
            '',
            [
              { Ref: 'MyLambdaCCE802FB' },
              ':prod',
            ],
          ],
        },
      }],
    });
  });

  test('sanity checks provisionedConcurrentExecutions', () => {
    const stack = new Stack();
    const pce = -1;

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN: Alias provisionedConcurrencyConfig less than 0
    expect(() => {
      new lambda.Alias(stack, 'Alias1', {
        aliasName: 'prod',
        version: fn.addVersion('1'),
        provisionedConcurrentExecutions: pce,
      });
    }).toThrow();

    // WHEN: Version provisionedConcurrencyConfig less than 0
    expect(() => {
      new lambda.Version(stack, 'Version 1', {
        lambda: fn,
        codeSha256: undefined,
        description: undefined,
        provisionedConcurrentExecutions: pce,
      });
    }).toThrow();

    // WHEN: Adding a version provisionedConcurrencyConfig less than 0
    expect(() => {
      fn.addVersion('1', undefined, undefined, pce);
    }).toThrow();
  });

  test('alias exposes real Lambdas role', () => {
    const stack = new Stack();

    // GIVEN
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1');
    const alias = new lambda.Alias(stack, 'Alias', { aliasName: 'prod', version });

    // THEN
    expect(alias.role).toEqual(fn.role);
  });

  test('functionName is derived from the aliasArn so that dependencies are sound', () => {
    const stack = new Stack();

    // GIVEN
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1');
    const alias = new lambda.Alias(stack, 'Alias', { aliasName: 'prod', version });

    // WHEN
    expect(stack.resolve(alias.functionName)).toEqual({
      'Fn::Join': [
        '',
        [
          {
            'Fn::Select': [
              6,
              {
                'Fn::Split': [
                  ':',
                  {
                    Ref: 'Alias325C5727',
                  },
                ],
              },
            ],
          },
          ':prod',
        ],
      ],
    });
  });

  test('with event invoke config', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'fn', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });
    const version = fn.addVersion('1');

    // WHEN
    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
      onSuccess: {
        bind: () => ({
          destination: 'on-success-arn',
        }),
      },
    });

    // THEN
    expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: {
        Ref: 'fn5FF616E3',
      },
      Qualifier: {
        'Fn::Select': [
          7,
          {
            'Fn::Split': [
              ':',
              {
                Ref: 'Alias325C5727',
              },
            ],
          },
        ],
      },
      DestinationConfig: {
        OnSuccess: {
          Destination: 'on-success-arn',
        },
      },
    });
  });

  test('throws when calling configureAsyncInvoke on already configured alias', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'fn', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });
    const version = fn.addVersion('1');
    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
      onSuccess: {
        bind: () => ({
          destination: 'on-success-arn',
        }),
      },
    });

    // THEN
    expect(() => alias.configureAsyncInvoke({ retryAttempts: 0 })).toThrow(/An EventInvokeConfig has already been configured/);
  });

  test('event invoke config on imported alias', () => {
    // GIVEN
    const stack = new Stack();
    const fn = lambda.Version.fromVersionArn(stack, 'Fn', 'arn:aws:lambda:region:account-id:function:function-name:version');
    const alias = lambda.Alias.fromAliasAttributes(stack, 'Alias', { aliasName: 'alias-name', aliasVersion: fn });

    // WHEN
    alias.configureAsyncInvoke({
      retryAttempts: 1,
    });

    // THEN
    expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: 'function-name',
      Qualifier: 'alias-name',
      MaximumRetryAttempts: 1,
    });
  });

  test('can enable AutoScaling on aliases', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1', undefined, 'testing');

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
    });

    // WHEN
    alias.addAutoScaling({ maxCapacity: 5 });

    // THEN
    expect(stack).toHaveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      MinCapacity: 1,
      MaxCapacity: 5,
      ResourceId: objectLike({
        'Fn::Join': arrayWith(arrayWith(
          'function:',
          objectLike({
            'Fn::Select': arrayWith(
              {
                'Fn::Split': arrayWith(
                  { Ref: 'Alias325C5727' }),
              },
            ),
          }),
          ':prod',
        )),
      }),
    });
  });

  test('can enable AutoScaling on aliases with Provisioned Concurrency set', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1', undefined, 'testing');

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
      provisionedConcurrentExecutions: 10,
    });

    // WHEN
    alias.addAutoScaling({ maxCapacity: 5 });

    // THEN
    expect(stack).toHaveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      MinCapacity: 1,
      MaxCapacity: 5,
      ResourceId: objectLike({
        'Fn::Join': arrayWith(arrayWith(
          'function:',
          objectLike({
            'Fn::Select': arrayWith(
              {
                'Fn::Split': arrayWith(
                  { Ref: 'Alias325C5727' }),
              },
            ),
          }),
          ':prod',
        )),
      }),
    });

    expect(stack).toHaveResourceLike('AWS::Lambda::Alias', {
      ProvisionedConcurrencyConfig: {
        ProvisionedConcurrentExecutions: 10,
      },
    });
  });

  test('validation for utilizationTarget does not fail when using Tokens', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1', undefined, 'testing');

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
      provisionedConcurrentExecutions: 10,
    });

    // WHEN
    const target = alias.addAutoScaling({ maxCapacity: 5 });

    target.scaleOnUtilization({ utilizationTarget: Lazy.number({ produce: () => 0.95 }) });

    // THEN: no exception
    expect(stack).toHaveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization' },
        TargetValue: 0.95,
      },
    });
  });

  test('cannot enable AutoScaling twice on same property', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1', undefined, 'testing');

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
    });

    // WHEN
    alias.addAutoScaling({ maxCapacity: 5 });

    // THEN
    expect(() => alias.addAutoScaling({ maxCapacity: 8 })).toThrow(/AutoScaling already enabled for this alias/);
  });

  test('error when specifying invalid utilization value when AutoScaling on utilization', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1', undefined, 'testing');

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
    });

    // WHEN
    const target = alias.addAutoScaling({ maxCapacity: 5 });

    // THEN
    expect(() => target.scaleOnUtilization({ utilizationTarget: 0.95 })).toThrow(/Utilization Target should be between 0.1 and 0.9. Found 0.95/);
  });

  test('can autoscale on a schedule', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1', undefined, 'testing');

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
    });

    // WHEN
    const target = alias.addAutoScaling({ maxCapacity: 5 });
    target.scaleOnSchedule('Scheduling', {
      schedule: appscaling.Schedule.cron({}),
      maxCapacity: 10,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ApplicationAutoScaling::ScalableTarget', {
      ScheduledActions: [
        {
          ScalableTargetAction: { MaxCapacity: 10 },
          Schedule: 'cron(* * * * ? *)',
          ScheduledActionName: 'Scheduling',
        },
      ],
    });
  });
});
