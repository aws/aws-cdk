import { Annotations, Match, Template } from '@aws-cdk/assertions';
import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Duration, Lazy, Stack } from '@aws-cdk/core';
import * as lambda from '../lib';
import { Alias, Architecture, IAlias, IVersion } from '../lib';

describe('alias', () => {
  describe('fromAliasAttributes', () => {
    let stack: Stack;
    let alias: IAlias;
    let role: Role;
    let version: IVersion;

    beforeEach(() => {
      stack = new Stack();
      role = new Role(stack, 'SomeRole', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      });
      const func = lambda.Function.fromFunctionAttributes(stack, 'iFunc', {
        functionArn: 'arn:aws:lambda:region:account-id:function:function-name',
        architecture: Architecture.ARM_64,
        timeout: Duration.minutes(5),
        role: role,
      });
      version = lambda.Version.fromVersionAttributes(stack, 'Version', {
        lambda: func,
        version: 'version',
      });
      alias = Alias.fromAliasAttributes(stack, 'alias', {
        aliasName: 'alias',
        aliasVersion: version,
      });
    });

    test('sets arn correctly', () => {
      expect(alias.functionArn).toBe('arn:aws:lambda:region:account-id:function:function-name:alias');
    });

    test('sets name correctly', () => {
      expect(alias.functionName).toBe('function-name:alias');
    });

    test('sets version correctly', () => {
      expect(alias.version).toBe(version);
    });

    test('sets alias name correctly', () => {
      expect(alias.aliasName).toBe('alias');
    });

    test('sets role correctly', () => {
      expect(alias.role).toBe(role);
    });

    test('sets timeout correctly', () => {
      expect(alias.timeout).toEqual(Duration.minutes(5));
    });

    test('sets architecture correctly', () => {
      expect(alias.architecture).toBe(Architecture.ARM_64);
    });
  });

  testDeprecated('version and aliases', () => {
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const version = fn.addVersion('1');

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Version', {
      FunctionName: { Ref: 'MyLambdaCCE802FB' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
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
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'latest',
      version: fn.latestVersion,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
      FunctionName: { Ref: 'MyLambdaCCE802FB' },
      FunctionVersion: '$LATEST',
      Name: 'latest',
    });
    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Version', 0);
  });

  testDeprecated('can use newVersion to create a new Version', () => {
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const version = fn.addVersion('NewVersion');

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Version', {
      FunctionName: { Ref: 'MyLambdaCCE802FB' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
      FunctionName: { Ref: 'MyLambdaCCE802FB' },
      Name: 'prod',
    });
  });

  testDeprecated('can add additional versions to alias', () => {
    const stack = new Stack();

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const version1 = fn.addVersion('1');
    const version2 = fn.addVersion('2');

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: version1,
      additionalVersions: [{ version: version2, weight: 0.1 }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
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

  testDeprecated('version and aliases with provisioned execution', () => {
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const pce = 5;
    const version = fn.addVersion('1', undefined, 'testing', pce);

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
      provisionedConcurrentExecutions: pce,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Version', {
      ProvisionedConcurrencyConfig: {
        ProvisionedConcurrentExecutions: 5,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
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
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const version = fn.currentVersion;

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
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const version = fn.currentVersion;
    const alias = new lambda.Alias(stack, 'Alias', { aliasName: 'prod', version });

    // WHEN
    new cloudwatch.Alarm(stack, 'Alarm', {
      metric: alias.metric('Test'),
      alarmName: 'Test',
      threshold: 1,
      evaluationPeriods: 1,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
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

  testDeprecated('sanity checks provisionedConcurrentExecutions', () => {
    const stack = new Stack();
    const pce = -1;

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    // WHEN: Alias provisionedConcurrencyConfig less than 0
    expect(() => {
      new lambda.Alias(stack, 'Alias1', {
        aliasName: 'prod',
        version: fn.currentVersion,
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
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const version = fn.currentVersion;
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
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const version = fn.currentVersion;
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
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    // WHEN
    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: fn.currentVersion,
      onSuccess: {
        bind: () => ({
          destination: 'on-success-arn',
        }),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
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
      runtime: lambda.Runtime.NODEJS_14_X,
    });
    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: fn.currentVersion,
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
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
      FunctionName: 'function-name',
      Qualifier: 'alias-name',
      MaximumRetryAttempts: 1,
    });
  });

  testDeprecated('can enable AutoScaling on aliases', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: fn.currentVersion,
    });

    // WHEN
    alias.addAutoScaling({ maxCapacity: 5 });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
      MinCapacity: 1,
      MaxCapacity: 5,
      ResourceId: Match.objectLike({
        'Fn::Join': Match.arrayWith([Match.arrayWith([
          'function:',
          Match.objectLike({
            'Fn::Select': Match.arrayWith([
              {
                'Fn::Split': Match.arrayWith([
                  { Ref: 'Alias325C5727' },
                ]),
              },
            ]),
          }),
          ':prod',
        ])]),
      }),
    });
  });

  test('can enable AutoScaling on aliases with Provisioned Concurrency set', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: fn.currentVersion,
      provisionedConcurrentExecutions: 10,
    });

    // WHEN
    alias.addAutoScaling({ maxCapacity: 5 });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
      MinCapacity: 1,
      MaxCapacity: 5,
      ResourceId: Match.objectLike({
        'Fn::Join': Match.arrayWith([Match.arrayWith([
          'function:',
          Match.objectLike({
            'Fn::Select': Match.arrayWith([
              {
                'Fn::Split': Match.arrayWith([
                  { Ref: 'Alias325C5727' },
                ]),
              },
            ]),
          }),
          ':prod',
        ])]),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
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
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: fn.currentVersion,
      provisionedConcurrentExecutions: 10,
    });

    // WHEN
    const target = alias.addAutoScaling({ maxCapacity: 5 });

    target.scaleOnUtilization({ utilizationTarget: Lazy.number({ produce: () => 0.95 }) });

    // THEN: no exception
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
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
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: fn.currentVersion,
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
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: fn.currentVersion,
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
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: fn.currentVersion,
    });

    // WHEN
    const target = alias.addAutoScaling({ maxCapacity: 5 });
    target.scaleOnSchedule('Scheduling', {
      schedule: appscaling.Schedule.cron({}),
      maxCapacity: 10,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
      ScheduledActions: [
        {
          ScalableTargetAction: { MaxCapacity: 10 },
          Schedule: 'cron(* * * * ? *)',
          ScheduledActionName: 'Scheduling',
        },
      ],
    });
  });

  test('scheduled scaling shows warning when minute is not defined in cron', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: fn.currentVersion,
    });

    // WHEN
    const target = alias.addAutoScaling({ maxCapacity: 5 });
    target.scaleOnSchedule('Scheduling', {
      schedule: appscaling.Schedule.cron({}),
      maxCapacity: 10,
    });

    // THEN
    Annotations.fromStack(stack).hasWarning('/Default/Alias/AliasScaling/Target', "cron: If you don't pass 'minute', by default the event runs every minute. Pass 'minute: '*'' if that's what you intend, or 'minute: 0' to run once per hour instead.");
  });

  test('scheduled scaling shows no warning when minute is * in cron', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: fn.currentVersion,
    });

    // WHEN
    const target = alias.addAutoScaling({ maxCapacity: 5 });
    target.scaleOnSchedule('Scheduling', {
      schedule: appscaling.Schedule.cron({ minute: '*' }),
      maxCapacity: 10,
    });

    // THEN
    const annotations = Annotations.fromStack(stack).findWarning('*', Match.anyValue());
    expect(annotations.length).toBe(0);
  });

  test('addFunctionUrl creates a function url', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_14_X,
    });
    const aliasName = 'prod';
    const alias = new lambda.Alias(stack, 'Alias', {
      aliasName,
      version: fn.currentVersion,
    });

    // WHEN
    alias.addFunctionUrl();

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Url', {
      AuthType: 'AWS_IAM',
      TargetFunctionArn: {
        'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
      },
      Qualifier: aliasName,
    });
  });
});
