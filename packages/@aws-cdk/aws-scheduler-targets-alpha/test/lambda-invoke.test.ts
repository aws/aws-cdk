import { ScheduleExpression, Schedule, Group } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { LambdaInvoke } from '../lib/lambda-invoke';

describe('schedule target', () => {
  let app: App;
  let stack: Stack;
  let func: lambda.IFunction;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));

  beforeEach(() => {
    app = new App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } });
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    func = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      tracing: lambda.Tracing.PASS_THROUGH,
    });
  });

  test('creates IAM role and IAM policy for lambda target in the same account', () => {
    const lambdaTarget = new LambdaInvoke(func);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget637b5173FB8068', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [{
              'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
            },
            {
              'Fn::Join': [
                '', [
                  { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
                  ':*',
                ],
              ],
            }],
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget637b5173FB8068' }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': '123456789012',
                'aws:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':scheduler:us-east-1:123456789012:schedule-group/default',
                    ],
                  ],
                },
              },
            },
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
        ],
      },
    });
  });

  test('creates IAM role and IAM policy for lambda version', () => {
    const lambdaVersion = new lambda.Version(stack, 'MyLambdaVersion', {
      lambda: func,
    });
    const lambdaTarget = new LambdaInvoke(lambdaVersion);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'MyLambdaVersion2EF97E33',
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTargetd8a041965BDCA6', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: {
              Ref: 'MyLambdaVersion2EF97E33',
            },
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTargetd8a041965BDCA6' }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': '123456789012',
                'aws:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':scheduler:us-east-1:123456789012:schedule-group/default',
                    ],
                  ],
                },
              },
            },
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
        ],
      },
    });
  });

  test('creates IAM policy for provided IAM role', () => {
    const targetExecutionRole = new Role(stack, 'ProvidedTargetRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    const lambdaTarget = new LambdaInvoke(func, {
      role: targetExecutionRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);
    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': ['ProvidedTargetRole8CFDD54A', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [{
              'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
            },
            {
              'Fn::Join': [
                '', [
                  { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
                  ':*',
                ],
              ],
            }],
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules with the same target from the same account', () => {
    const lambdaTarget = new LambdaInvoke(func);

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: lambdaTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);
    Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': '123456789012',
                'aws:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':scheduler:us-east-1:123456789012:schedule-group/default',
                    ],
                  ],
                },
              },
            },
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
        ],
      },
    }, 1);

    Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [{
              'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
            },
            {
              'Fn::Join': [
                '', [
                  { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
                  ':*',
                ],
              ],
            }],
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget637b5173FB8068' }],
    }, 1);
  });

  test('creates IAM role and IAM policy for two schedules with the same target but different groups', () => {
    const lambdaTarget = new LambdaInvoke(func);
    const group = new Group(stack, 'Group', {
      groupName: 'mygroup',
    });

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: lambdaTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: lambdaTarget,
      group,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);
    Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': '123456789012',
                'aws:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':scheduler:us-east-1:123456789012:schedule-group/default',
                    ],
                  ],
                },
              },
            },
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
          {
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': '123456789012',
                'aws:SourceArn': {
                  'Fn::GetAtt': [
                    'GroupC77FDACD',
                    'Arn',
                  ],
                },
              },
            },
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
        ],
      },
    }, 1);

    Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [{
              'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
            },
            {
              'Fn::Join': [
                '', [
                  { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
                  ':*',
                ],
              ],
            }],
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget637b5173FB8068' }],
    }, 1);
  });

  test('creates IAM policy for imported lambda function in the same account', () => {
    const importedFunc = lambda.Function.fromFunctionArn(stack, 'ImportedFunction', 'arn:aws:lambda:us-east-1:123456789012:function/somefunc');

    const lambdaTarget = new LambdaInvoke(importedFunc);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: 'arn:aws:lambda:us-east-1:123456789012:function/somefunc',
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget2ad129D7CAA2E6', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [
              'arn:aws:lambda:us-east-1:123456789012:function/somefunc',
              'arn:aws:lambda:us-east-1:123456789012:function/somefunc:*',
            ],
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget2ad129D7CAA2E6' }],
    });
  });

  test('creates IAM role and IAM policy for lambda alias', () => {
    const lambdaVersion = new lambda.Version(stack, 'MyLambdaVersion', {
      lambda: func,
    });
    const lambdaAlias = new lambda.Alias(stack, 'MyLambdaAlias', {
      version: lambdaVersion,
      aliasName: 'SomeAliasName',
    });

    const lambdaTarget = new LambdaInvoke(lambdaAlias);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'MyLambdaAliasD26C43B4',
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget447112D2459CC7', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: {
              Ref: 'MyLambdaAliasD26C43B4',
            },
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget447112D2459CC7' }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': '123456789012',
                'aws:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':scheduler:us-east-1:123456789012:schedule-group/default',
                    ],
                  ],
                },
              },
            },
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
        ],
      },
    });
  });

  test('creates IAM policy for imported role for lambda function in the same account', () => {
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const lambdaTarget = new LambdaInvoke(func, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);
    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
          },
          RoleArn: 'arn:aws:iam::123456789012:role/someRole',
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [{
              'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
            },
            {
              'Fn::Join': [
                '', [
                  { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
                  ':*',
                ],
              ],
            }],
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for imported lambda function with imported IAM role in the same account', () => {
    const importedFunc = lambda.Function.fromFunctionArn(stack, 'ImportedFunction', 'arn:aws:lambda:us-east-1:123456789012:function/somefunc');
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const lambdaTarget = new LambdaInvoke(importedFunc, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);
    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: 'arn:aws:lambda:us-east-1:123456789012:function/somefunc',
          RoleArn: 'arn:aws:iam::123456789012:role/someRole',
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [
              'arn:aws:lambda:us-east-1:123456789012:function/somefunc',
              'arn:aws:lambda:us-east-1:123456789012:function/somefunc:*',
            ],
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('using imported lambda function should not throw', () => {
    const lambdaFuncArn = 'arn:aws:lambda:us-east-1:234567890123:function/somefunc';
    const importedFunc = lambda.Function.fromFunctionAttributes(
      stack,
      'ImportedLambdaFunction',
      {
        functionArn: lambdaFuncArn,
        skipPermissions: true,
      },
    );

    const lambdaTarget = new LambdaInvoke(importedFunc);
    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [
              lambdaFuncArn,
              `${lambdaFuncArn}:*`,
            ],
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTargetfdfcef0FF637F7' }],
    });
  });

  test('adds permissions to execution role for sending messages to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const lambdaTarget = new LambdaInvoke(func, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [{
              'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
            },
            {
              'Fn::Join': [
                '', [
                  { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
                  ':*',
                ],
              ],
            }],
          },
          {
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['DummyDeadLetterQueueCEBF3463', 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget637b5173FB8068' }],
    });
  });

  test('adds permission to execution role when imported DLQ is in same account', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');

    const lambdaTarget = new LambdaInvoke(func, {
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [{
              'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
            },
            {
              'Fn::Join': [
                '', [
                  { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
                  ':*',
                ],
              ],
            }],
          },
          {
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: importedQueue.queueArn,
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget637b5173FB8068' }],
    });
  });

  test('renders expected retry policy', () => {
    const lambdaTarget = new LambdaInvoke(func, {
      retryAttempts: 5,
      maxEventAge: Duration.hours(3),
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget637b5173FB8068', 'Arn'] },
          RetryPolicy: {
            MaximumEventAgeInSeconds: 10800,
            MaximumRetryAttempts: 5,
          },
        },
      },
    });
  });

  test('throws when retry policy max age is more than 1 day', () => {
    const lambdaTarget = new LambdaInvoke(func, {
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: lambdaTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 1 minute', () => {
    const lambdaTarget = new LambdaInvoke(func, {
      maxEventAge: Duration.seconds(59),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: lambdaTarget,
      })).toThrow(/Minimum event age is 1 minute/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const lambdaTarget = new LambdaInvoke(func, {
      retryAttempts: 200,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: lambdaTarget,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });
});
