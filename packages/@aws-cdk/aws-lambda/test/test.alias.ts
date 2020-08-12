import { arrayWith, beASupersetOfTemplate, expect, haveResource, haveResourceLike, objectLike } from '@aws-cdk/assert';
import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Lazy, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as lambda from '../lib';

export = {
  'version and aliases'(test: Test): void {
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

    expect(stack).to(beASupersetOfTemplate({
      MyLambdaVersion16CDE3C40: {
        Type: 'AWS::Lambda::Version',
        Properties: {
          FunctionName: { Ref: 'MyLambdaCCE802FB' },
        },
      },
      Alias325C5727: {
        Type: 'AWS::Lambda::Alias',
        Properties: {
          FunctionName: { Ref: 'MyLambdaCCE802FB' },
          FunctionVersion: stack.resolve(version.version),
          Name: 'prod',
        },
      },
    }));

    test.done();
  },

  'can create an alias to $LATEST'(test: Test): void {
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

    expect(stack).to(haveResource('AWS::Lambda::Alias', {
      FunctionName: { Ref: 'MyLambdaCCE802FB' },
      FunctionVersion: '$LATEST',
      Name: 'latest',
    }));
    expect(stack).notTo(haveResource('AWS::Lambda::Version'));

    test.done();
  },

  'can use newVersion to create a new Version'(test: Test) {
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

    expect(stack).to(haveResourceLike('AWS::Lambda::Version', {
      FunctionName: { Ref: 'MyLambdaCCE802FB' },
    }));

    expect(stack).to(haveResourceLike('AWS::Lambda::Alias', {
      FunctionName: { Ref: 'MyLambdaCCE802FB' },
      Name: 'prod',
    }));

    test.done();
  },

  'can add additional versions to alias'(test: Test) {
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

    expect(stack).to(haveResource('AWS::Lambda::Alias', {
      FunctionVersion: stack.resolve(version1.version),
      RoutingConfig: {
        AdditionalVersionWeights: [
          {
            FunctionVersion: stack.resolve(version2.version),
            FunctionWeight: 0.1,
          },
        ],
      },
    }));

    test.done();
  },
  'version and aliases with provisioned execution'(test: Test): void {
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

    expect(stack).to(beASupersetOfTemplate({
      MyLambdaVersion16CDE3C40: {
        Type: 'AWS::Lambda::Version',
        Properties: {
          FunctionName: {
            Ref: 'MyLambdaCCE802FB',
          },
          ProvisionedConcurrencyConfig: {
            ProvisionedConcurrentExecutions: 5,
          },
        },
      },
      Alias325C5727: {
        Type: 'AWS::Lambda::Alias',
        Properties: {
          FunctionName: { Ref: 'MyLambdaCCE802FB' },
          FunctionVersion: stack.resolve(version.version),
          Name: 'prod',
          ProvisionedConcurrencyConfig: {
            ProvisionedConcurrentExecutions: 5,
          },
        },
      },
    }));

    test.done();
  },
  'sanity checks on version weights'(test: Test) {
    const stack = new Stack();

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1');

    // WHEN: Individual weight too high
    test.throws(() => {
      new lambda.Alias(stack, 'Alias1', {
        aliasName: 'prod',
        version,
        additionalVersions: [{ version, weight: 5 }],
      });
    });

    // WHEN: Sum too high
    test.throws(() => {
      new lambda.Alias(stack, 'Alias2', {
        aliasName: 'prod',
        version,
        additionalVersions: [{ version, weight: 0.5 }, { version, weight: 0.6 }],
      });
    });

    test.done();
  },

  'metric adds Resource: aliasArn to dimensions'(test: Test) {
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
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
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
    }));

    test.done();
  },

  'sanity checks provisionedConcurrentExecutions'(test: Test) {
    const stack = new Stack();
    const pce = -1;

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN: Alias provisionedConcurrencyConfig less than 0
    test.throws(() => {
      new lambda.Alias(stack, 'Alias1', {
        aliasName: 'prod',
        version: fn.addVersion('1'),
        provisionedConcurrentExecutions: pce,
      });
    });

    // WHEN: Version provisionedConcurrencyConfig less than 0
    test.throws(() => {
      new lambda.Version(stack, 'Version 1', {
        lambda: fn,
        codeSha256: undefined,
        description: undefined,
        provisionedConcurrentExecutions: pce,
      });
    });

    // WHEN: Adding a version provisionedConcurrencyConfig less than 0
    test.throws(() => {
      fn.addVersion('1', undefined, undefined, pce);
    });

    test.done();
  },

  'alias exposes real Lambdas role'(test: Test) {
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
    test.equals(alias.role, fn.role);

    test.done();
  },

  'functionName is derived from the aliasArn so that dependencies are sound'(test: Test) {
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
    test.deepEqual(stack.resolve(alias.functionName), {
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

    test.done();
  },

  'with event invoke config'(test: Test) {
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
    expect(stack).to(haveResource('AWS::Lambda::EventInvokeConfig', {
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
    }));

    test.done();
  },

  'throws when calling configureAsyncInvoke on already configured alias'(test: Test) {
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
    test.throws(() => alias.configureAsyncInvoke({ retryAttempts: 0 }), /An EventInvokeConfig has already been configured/);

    test.done();
  },

  'event invoke config on imported alias'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const fn = lambda.Version.fromVersionArn(stack, 'Fn', 'arn:aws:lambda:region:account-id:function:function-name:version');
    const alias = lambda.Alias.fromAliasAttributes(stack, 'Alias', { aliasName: 'alias-name', aliasVersion: fn });

    // WHEN
    alias.configureAsyncInvoke({
      retryAttempts: 1,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: 'function-name',
      Qualifier: 'alias-name',
      MaximumRetryAttempts: 1,
    }));

    test.done();
  },

  'can enable AutoScaling on aliases'(test: Test): void {
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
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
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
    }));

    test.done();
  },

  'can enable AutoScaling on aliases with Provisioned Concurrency set'(test: Test): void {
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
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
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
    }));

    expect(stack).to(haveResourceLike('AWS::Lambda::Alias', {
      ProvisionedConcurrencyConfig: {
        ProvisionedConcurrentExecutions: 10,
      },
    }));
    test.done();
  },

  'validation for utilizationTarget does not fail when using Tokens'(test: Test) {
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

    target.scaleOnUtilization({ utilizationTarget: Lazy.numberValue({ produce: () => 0.95 }) });

    // THEN: no exception
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization' },
        TargetValue: 0.95,
      },

    }));

    test.done();
  },

  'cannot enable AutoScaling twice on same property'(test: Test): void {
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
    test.throws(() => alias.addAutoScaling({ maxCapacity: 8 }), /AutoScaling already enabled for this alias/);

    test.done();
  },

  'error when specifying invalid utilization value when AutoScaling on utilization'(test: Test): void {
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
    test.throws(() => target.scaleOnUtilization({ utilizationTarget: 0.95 }), /Utilization Target should be between 0.1 and 0.9. Found 0.95/);
    test.done();
  },

  'can autoscale on a schedule'(test: Test): void {
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
    expect(stack).to(haveResourceLike('AWS::ApplicationAutoScaling::ScalableTarget', {
      ScheduledActions: [
        {
          ScalableTargetAction: { MaxCapacity: 10 },
          Schedule: 'cron(* * * * ? *)',
          ScheduledActionName: 'Scheduling',
        },
      ],
    }));

    test.done();
  },
};
