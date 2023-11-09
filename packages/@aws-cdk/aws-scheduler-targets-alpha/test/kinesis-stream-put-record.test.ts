import { ScheduleExpression, Schedule } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { KinesisStreamPutRecord } from '../lib';

describe('schedule target', () => {
  let app: App;
  let stack: Stack;
  let stream: kinesis.Stream;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    stream = new kinesis.Stream(stack, 'MyStream');
  });

  test('creates IAM role and IAM policy for kinesis stream target in the same account', () => {
    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: streamTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
          RetryPolicy: {},
          KinesisParameters: {
            PartitionKey: 'key',
          },
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['kinesis:ListShards', 'kinesis:PutRecord', 'kinesis:PutRecords'],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
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

    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
      role: targetExecutionRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: streamTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': ['ProvidedTargetRole8CFDD54A', 'Arn'] },
          RetryPolicy: {},
          KinesisParameters: {
            PartitionKey: 'key',
          },
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['kinesis:ListShards', 'kinesis:PutRecord', 'kinesis:PutRecords'],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules from the same account', () => {
    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
    });

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: streamTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: streamTarget,
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
            Action: ['kinesis:ListShards', 'kinesis:PutRecord', 'kinesis:PutRecords'],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    }, 1);
  });

  test('creates IAM policy for imported stream in the same account', () => {
    const importedStream = kinesis.Stream.fromStreamArn(stack, 'ImportedStream', 'arn:aws:kinesis:us-east-1:123456789012:stream/Foo');

    const streamTarget = new KinesisStreamPutRecord(importedStream, {
      partitionKey: 'key',
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: streamTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: 'arn:aws:kinesis:us-east-1:123456789012:stream/Foo',
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTargetc84bec4179F64E', 'Arn'] },
          RetryPolicy: {},
          KinesisParameters: {
            PartitionKey: 'key',
          },
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['kinesis:ListShards', 'kinesis:PutRecord', 'kinesis:PutRecords'],
            Effect: 'Allow',
            Resource: 'arn:aws:kinesis:us-east-1:123456789012:stream/Foo',
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTargetc84bec4179F64E' }],
    });
  });

  test('creates IAM policy for imported role for stream in the same account', () => {
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: streamTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
          },
          RoleArn: 'arn:aws:iam::123456789012:role/someRole',
          RetryPolicy: {},
          KinesisParameters: {
            PartitionKey: 'key',
          },
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['kinesis:ListShards', 'kinesis:PutRecord', 'kinesis:PutRecords'],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
            },
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for imported stream with imported IAM role in the same account', () => {
    const importedStream = kinesis.Stream.fromStreamArn(stack, 'ImportedStream', 'arn:aws:kinesis:us-east-1:123456789012:stream/Foo');
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const streamTarget = new KinesisStreamPutRecord(importedStream, {
      partitionKey: 'key',
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: streamTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: 'arn:aws:kinesis:us-east-1:123456789012:stream/Foo',
          RoleArn: 'arn:aws:iam::123456789012:role/someRole',
          RetryPolicy: {},
          KinesisParameters: {
            PartitionKey: 'key',
          },
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['kinesis:ListShards', 'kinesis:PutRecord', 'kinesis:PutRecords'],
            Effect: 'Allow',
            Resource: 'arn:aws:kinesis:us-east-1:123456789012:stream/Foo',
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test.each([
    ['account', 'arn:aws:kinesis:us-east-1:999999999999:stream/Foo', /Both the schedule and the stream must be in the same account./],
    ['region', 'arn:aws:kinesis:eu-central-1:123456789012:stream/Foo', /Both the schedule and the stream must be in the same region./],
  ])('throws when Kinesis Data Stream is imported from different %s', (_, arn: string, expectedError: RegExp) => {
    const importedStream = kinesis.Stream.fromStreamArn(stack, 'ImportedStream', arn);
    const streamTarget = new KinesisStreamPutRecord(importedStream, {
      partitionKey: 'key',
    });
    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: streamTarget,
      })).toThrow(expectedError);
  });

  test('throws when IAM role is imported from different account', () => {
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::234567890123:role/someRole');

    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
      role: importedRole,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: streamTarget,
      })).toThrow(/Both the target and the execution role must be in the same account/);
  });

  test('adds permissions to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: streamTarget,
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

    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
      deadLetterQueue: dlq,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: streamTarget,
      })).toThrow(/Both the queue and the schedule must be in the same region./);
  });

  test('does not create a queue policy when DLQ is imported', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:somequeue1');

    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: streamTarget,
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

    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: streamTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::SQS::QueuePolicy', 0);
  });

  test('renders expected retry policy', () => {
    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
      retryAttempts: 5,
      maxEventAge: Duration.hours(3),
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: streamTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
          RetryPolicy: {
            MaximumEventAgeInSeconds: 10800,
            MaximumRetryAttempts: 5,
          },
          KinesisParameters: {
            PartitionKey: 'key',
          },
        },
      },
    });
  });

  test('throws when retry policy max age is more than 1 day', () => {
    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: streamTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 15 minutes', () => {
    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
      maxEventAge: Duration.minutes(5),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: streamTarget,
      })).toThrow(/Minimum event age is 15 minutes/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const streamTarget = new KinesisStreamPutRecord(stream, {
      partitionKey: 'key',
      retryAttempts: 200,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: streamTarget,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });

  test('throws when partitionKey length is less than 1', () => {
    expect(() =>
      new KinesisStreamPutRecord(stream, {
        partitionKey: '',
      })).toThrow(/partitionKey length must be between 1 and 256, got 0/);
  });

  test('throws when partitionKey length is greater than 256', () => {
    expect(() =>
      new KinesisStreamPutRecord(stream, {
        partitionKey: 'a'.repeat(257),
      })).toThrow(/partitionKey length must be between 1 and 256, got 257/);
  });
});