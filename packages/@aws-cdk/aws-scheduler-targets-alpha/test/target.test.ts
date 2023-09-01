import { ScheduleExpression, Schedule } from '@aws-cdk/aws-scheduler-alpha';
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
    app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    func = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      tracing: lambda.Tracing.PASS_THROUGH,
    });
  });

  test('creates IAM role and IAM policy for lambda target in the same account', () => {
    const lambdaTarget = new LambdaInvoke(func, {});

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
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
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
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: { StringEquals: { 'aws:SourceAccount': '123456789012' } },
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

  test('reuses IAM role and IAM policy for two schedules from the same account', () => {
    const lambdaTarget = new LambdaInvoke(func, { });

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
            Condition: { StringEquals: { 'aws:SourceAccount': '123456789012' } },
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
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    }, 1);
  });

  test('creates IAM policy for imported lambda function in the same account', () => {
    const importedFunc = lambda.Function.fromFunctionArn(stack, 'ImportedFunction', 'arn:aws:lambda:us-east-1:123456789012:function/somefunc');

    const lambdaTarget = new LambdaInvoke(importedFunc, {});

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

  test('throws when lambda function is imported from different account', () => {
    const importedFunc = lambda.Function.fromFunctionArn(stack, 'ImportedFunction', 'arn:aws:lambda:us-east-1:234567890123:function/somefunc');

    const lambdaTarget = new LambdaInvoke(importedFunc, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: lambdaTarget,
      })).toThrow(/Both the schedule and the function must be in the same account/);
  });

  test('throws when lambda function is imported from different region', () => {
    const importedFunc = lambda.Function.fromFunctionArn(stack, 'ImportedFunction', 'arn:aws:lambda:us-west-2:123456789012:function/somefunc');

    const lambdaTarget = new LambdaInvoke(importedFunc, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: lambdaTarget,
      })).toThrow(/Both the schedule and the function must be in the same region/);
  });

  test('throws when IAM role is imported from different account', () => {
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::234567890123:role/someRole');

    const lambdaTarget = new LambdaInvoke(func, {
      role: importedRole,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: lambdaTarget,
      })).toThrow(/Both the target and the execution role must be in the same account/);
  });

  test('adds permissions to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const lambdaTarget = new LambdaInvoke(func, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['DummyDeadLetterQueueCEBF3463', 'Arn'],
            },
          },
        ],
      },
      Queues: [
        {
          Ref: 'DummyDeadLetterQueueCEBF3463',
        },
      ],
    });
  });

  test('throws when adding permissions to DLQ from a different region', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'eu-west-2',
      },
    });
    const queue = new sqs.Queue(stack2, 'DummyDeadLetterQueue');

    const lambdaTarget = new LambdaInvoke(func, {
      deadLetterQueue: queue,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: lambdaTarget,
      })).toThrow(/Both the queue and the schedule must be in the same region./);
  });

  test('does not create a queue policy when DLQ is imported', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');

    const lambdaTarget = new LambdaInvoke(func, {
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::SQS::QueuePolicy', 0);
  });

  test('does not create a queue policy when DLQ is created in a different account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '234567890123',
      },
    });

    const queue = new sqs.Queue(stack2, 'DummyDeadLetterQueue', {
      queueName: 'DummyDeadLetterQueue',
    });

    const lambdaTarget = new LambdaInvoke(func, {
      deadLetterQueue: queue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::SQS::QueuePolicy', 0);
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
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
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

  test('throws when retry policy max age is less than 15 minutes', () => {
    const lambdaTarget = new LambdaInvoke(func, {
      maxEventAge: Duration.minutes(5),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: lambdaTarget,
      })).toThrow(/Minimum event age is 15 minutes/);
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
