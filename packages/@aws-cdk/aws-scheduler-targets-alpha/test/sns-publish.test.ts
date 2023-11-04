import { Schedule, ScheduleExpression } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SnsPublish } from '../lib';

describe('sns publish', () => {
  let app: App;
  let stack: Stack;
  let topic: Topic;

  const snsTopicArnRef = { Ref: 'TopicBFC7AF6E' };
  const snsPublishAction = 'sns:Publish';
  const expr = ScheduleExpression.at(new Date(Date.UTC(1991, 2, 24, 0, 0, 0)));

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    topic = new Topic(stack, 'Topic');
  });

  test('creates IAM role and IAM policy for SNS topic target in the same account', () => {
    const snsPublishTarget = new SnsPublish(topic, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: snsPublishTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: snsTopicArnRef,
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: snsPublishAction,
            Effect: 'Allow',
            Resource: snsTopicArnRef,
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    });

    template.hasResourceProperties('AWS::IAM::Role', {
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

    const snsPublishTarget = new SnsPublish(topic, {
      role: targetExecutionRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: snsPublishTarget,
    });
    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: snsTopicArnRef,
          RoleArn: { 'Fn::GetAtt': ['ProvidedTargetRole8CFDD54A', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: snsPublishAction,
            Effect: 'Allow',
            Resource: snsTopicArnRef,
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules from the same account', () => {
    const snsPublishTarget = new SnsPublish(topic, {});

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: snsPublishTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: snsPublishTarget,
    });

    const template = Template.fromStack(stack);

    template.resourcePropertiesCountIs('AWS::IAM::Role', {
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

    template.resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: snsPublishAction,
            Effect: 'Allow',
            Resource: snsTopicArnRef,
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    }, 1);
  });

  test('creates IAM policy for imported SNS topic in the same account', () => {
    const importedSnsTopicArn = 'arn:aws:sns:us-east-1:123456789012:topic';
    const importedSnsTopic = Topic.fromTopicArn(stack, 'ImportedTopic', importedSnsTopicArn);

    const snsPublishTarget = new SnsPublish(importedSnsTopic, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: snsPublishTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: importedSnsTopicArn,
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget3fbff0B5C996CB', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: snsPublishAction,
            Effect: 'Allow',
            Resource: importedSnsTopicArn,
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget3fbff0B5C996CB' }],
    });
  });

  test('creates IAM policy for imported role for SNS topic in the same account', () => {
    const importedRoleArn = 'arn:aws:iam::123456789012:role/someRole';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', importedRoleArn);

    const snsTopicTarget = new SnsPublish(topic, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: snsTopicTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: snsTopicArnRef,
          RoleArn: importedRoleArn,
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: snsPublishAction,
            Effect: 'Allow',
            Resource: snsTopicArnRef,
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for imported SNS topic with imported IAM role in the same account', () => {
    const importedSnsTopicArn = 'arn:aws:sns:us-east-1:123456789012:topic';
    const importedSnsTopic = Topic.fromTopicArn(stack, 'ImportedTopic', importedSnsTopicArn);
    const importedRoleArn = 'arn:aws:iam::123456789012:role/someRole';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', importedRoleArn);

    const snsTopicTarget = new SnsPublish(importedSnsTopic, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: snsTopicTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: importedSnsTopicArn,
          RoleArn: importedRoleArn,
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: snsPublishAction,
            Effect: 'Allow',
            Resource: importedSnsTopicArn,
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test.each([
    ['account', 'arn:aws:sns:us-east-1:999999999999:topic', /Both the schedule and the topic must be in the same account./],
    ['region', 'arn:aws:sns:eu-central-1:123456789012:topic', /Both the schedule and the topic must be in the same region./],
  ])('throws when SNS topic is imported from different %s', (_, arn: string, expectedError: RegExp) => {
    const importedSnsTopic = Topic.fromTopicArn(stack, 'ImportedTopic', arn);
    const snsTopicTarget = new SnsPublish(importedSnsTopic, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: snsTopicTarget,
      })).toThrow(expectedError);
  });

  test('throws when IAM role is imported from different account', () => {
    const anotherAccountId = '123456789015';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', `arn:aws:iam::${anotherAccountId}:role/someRole`);

    const snsPublishTarget = new SnsPublish(topic, {
      role: importedRole,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: snsPublishTarget,
      })).toThrow(/Both the target and the execution role must be in the same account/);
  });

  test('adds permissions to DLQ', () => {
    const dlq = new Queue(stack, 'DummyDeadLetterQueue');

    const snsPublishTarget = new SnsPublish(topic, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: snsPublishTarget,
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
    const queue = new Queue(stack2, 'DummyDeadLetterQueue');

    const snsPublishTarget = new SnsPublish(topic, {
      deadLetterQueue: queue,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: snsPublishTarget,
      })).toThrow(/Both the queue and the schedule must be in the same region./);
  });

  test('does not create a queue policy when DLQ is imported', () => {
    const importedQueue = Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');

    const snsPublishTarget = new SnsPublish(topic, {
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: snsPublishTarget,
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

    const queue = new Queue(stack2, 'DummyDeadLetterQueue', {
      queueName: 'DummyDeadLetterQueue',
    });

    const snsPublishTarget = new SnsPublish(topic, {
      deadLetterQueue: queue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: snsPublishTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::SQS::QueuePolicy', 0);
  });

  test('renders expected retry policy', () => {
    const snsPublishTarget = new SnsPublish(topic, {
      retryAttempts: 5,
      maxEventAge: Duration.hours(3),
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: snsPublishTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: snsTopicArnRef,
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
    const snsPublishTarget = new SnsPublish(topic, {
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: snsPublishTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 15 minutes', () => {
    const snsPublishTarget = new SnsPublish(topic, {
      maxEventAge: Duration.minutes(5),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: snsPublishTarget,
      })).toThrow(/Minimum event age is 15 minutes/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const snsPublishTarget = new SnsPublish(topic, {
      retryAttempts: 200,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: snsPublishTarget,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });
});