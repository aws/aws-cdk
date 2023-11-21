import { ScheduleExpression, Schedule } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { SqsSendMessage } from '../lib';

describe('schedule target', () => {
  let app: App;
  let stack: Stack;
  let queue: sqs.IQueue;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    queue = new sqs.Queue(stack, 'MyQueue');
  });

  test('creates IAM role and IAM policy for sqs target in the same account', () => {
    const queueTarget = new SqsSendMessage(queue, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: queueTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyQueueE6CA6235', 'Arn'],
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
            Action: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyQueueE6CA6235', 'Arn'],
            },
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

    const queueTarget = new SqsSendMessage(queue, {
      role: targetExecutionRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: queueTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyQueueE6CA6235', 'Arn'],
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
            Action: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyQueueE6CA6235', 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules from the same account', () => {
    const queueTarget = new SqsSendMessage(queue, { });

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: queueTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: queueTarget,
    });

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
            Action: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyQueueE6CA6235', 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    }, 1);
  });

  test('creates IAM policy for imported queue in the same account', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:somequeue');

    const queueTarget = new SqsSendMessage(importedQueue, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: queueTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: 'arn:aws:sqs:us-east-1:123456789012:somequeue',
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget8dfffc5825B478', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
            Effect: 'Allow',
            Resource: 'arn:aws:sqs:us-east-1:123456789012:somequeue',
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget8dfffc5825B478' }],
    });
  });

  test('creates IAM policy for imported role for queue in the same account', () => {
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const queueTarget = new SqsSendMessage(queue, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: queueTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyQueueE6CA6235', 'Arn'],
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
            Action: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyQueueE6CA6235', 'Arn'],
            },
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for imported queue with imported IAM role in the same account', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:somequeue');
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const queueTarget = new SqsSendMessage(importedQueue, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: queueTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: 'arn:aws:sqs:us-east-1:123456789012:somequeue',
          RoleArn: 'arn:aws:iam::123456789012:role/someRole',
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
            Effect: 'Allow',
            Resource: 'arn:aws:sqs:us-east-1:123456789012:somequeue',
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('throws when queue is imported from different account', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:234567890123:somequeue');
    const queueTarget = new SqsSendMessage(importedQueue, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: queueTarget,
      })).toThrow(/Both the schedule and the queue must be in the same account/);
  });

  test('throws when queue is imported from different region', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-west-2:123456789012:somequeue');
    const queueTarget = new SqsSendMessage(importedQueue, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: queueTarget,
      })).toThrow(/Both the schedule and the queue must be in the same region/);
  });

  test('throws when IAM role is imported from different account', () => {
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::234567890123:role/someRole');

    const queueTarget = new SqsSendMessage(queue, {
      role: importedRole,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: queueTarget,
      })).toThrow(/Both the target and the execution role must be in the same account/);
  });

  test('adds permissions to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const queueTarget = new SqsSendMessage(queue, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: queueTarget,
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
    const dlq = new sqs.Queue(stack2, 'DummyDeadLetterQueue');

    const queueTarget = new SqsSendMessage(queue, {
      deadLetterQueue: dlq,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: queueTarget,
      })).toThrow(/Both the queue and the schedule must be in the same region./);
  });

  test('does not create a queue policy when DLQ is imported', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:somequeue1');

    const queueTarget = new SqsSendMessage(queue, {
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: queueTarget,
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

    const dlq = new sqs.Queue(stack2, 'DummyDeadLetterQueue', {
      queueName: 'DummyDeadLetterQueue',
    });

    const queueTarget = new SqsSendMessage(queue, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: queueTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::SQS::QueuePolicy', 0);
  });

  test('renders expected retry policy', () => {
    const queueTarget = new SqsSendMessage(queue, {
      retryAttempts: 5,
      maxEventAge: Duration.hours(3),
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: queueTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyQueueE6CA6235', 'Arn'],
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
    const queueTarget = new SqsSendMessage(queue, {
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: queueTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 15 minutes', () => {
    const queueTarget = new SqsSendMessage(queue, {
      maxEventAge: Duration.minutes(5),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: queueTarget,
      })).toThrow(/Minimum event age is 15 minutes/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const queueTarget = new SqsSendMessage(queue, {
      retryAttempts: 200,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: queueTarget,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });

  test('add message group id for target config', () => {
    const fifoQueue = new sqs.Queue(stack, 'FifoQueue', {
      fifo: true,
      contentBasedDeduplication: true,
    });
    const queueTarget = new SqsSendMessage(fifoQueue, {
      messageGroupId: 'messageGroupId',
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: queueTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['FifoQueueE5FF7273', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
          RetryPolicy: {},
          SqsParameters: {
            MessageGroupId: 'messageGroupId',
          },
        },
      },
    });
  });

  test('throws when messageGroupId length is less than 1', () => {
    const fifoQueue = new sqs.Queue(stack, 'FifoQueue', {
      fifo: true,
      contentBasedDeduplication: true,
    });
    expect(() =>
      new SqsSendMessage(fifoQueue, {
        messageGroupId: '',
      })).toThrow(/messageGroupId length must be between 1 and 128, got 0/);
  });

  test('throws when messageGroupId length is greater than 128', () => {
    const fifoQueue = new sqs.Queue(stack, 'FifoQueue', {
      fifo: true,
      contentBasedDeduplication: true,
    });
    expect(() =>
      new SqsSendMessage(fifoQueue, {
        messageGroupId: 'a'.repeat(129),
      })).toThrow(/messageGroupId length must be between 1 and 128, got 129/);
  });

  test('throws when queue is not FIFO queue if messageGroupId is specified', () => {
    const wrongQueue = new sqs.Queue(stack, 'WrongQueue', {
      fifo: false,
    });
    expect(() =>
      new SqsSendMessage(wrongQueue, {
        messageGroupId: 'id',
      })).toThrow(/target must be a FIFO queue if messageGroupId is specified/);
  });

  test('throws when contentBasedDeduplication is not true if queue is FIFO queue', () => {
    const wrongQueue = new sqs.Queue(stack, 'WrongQueue', {
      fifo: true,
      contentBasedDeduplication: false,
    });
    expect(() =>
      new SqsSendMessage(wrongQueue, {
        messageGroupId: 'id',
      })).toThrow(/contentBasedDeduplication must be true if the target is a FIFO queue/);
  });

  test('throws when queue is FIFO queue if messageGroupId is not specified', () => {
    const wrongQueue = new sqs.Queue(stack, 'WrongQueue', {
      fifo: true,
      contentBasedDeduplication: true,
    });
    expect(() =>
      new SqsSendMessage(wrongQueue, {})).toThrow(/messageGroupId must be specified if the target is a FIFO queue/);
  });
});
