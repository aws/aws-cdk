import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import { Group } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { SnsPublish } from '../lib/sns-publish';

describe('sns topic schedule target', () => {
  let app: App;
  let stack: Stack;
  let topic: sns.ITopic;
  const scheduleExpression = scheduler.ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));
  const roleId = 'SchedulerRoleForTarget0f6b2b82B558C1';

  beforeEach(() => {
    app = new App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } });
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    topic = new sns.Topic(stack, 'Topic');
  });

  test('creates IAM role and IAM policy for SNS topic in the same account', () => {
    const target = new SnsPublish(topic);

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'TopicBFC7AF6E',
          },
          RoleArn: {
            'Fn::GetAtt': [
              roleId, 'Arn',
            ],
          },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        ],
      },
      Roles: [{
        Ref: roleId,
      }],
    });

    template.hasResourceProperties('AWS::IAM::Role', {
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
    const targetExecutionRole = new iam.Role(stack, 'ProvidedTargetRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    const target = new SnsPublish(topic, {
      role: targetExecutionRole,
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'TopicBFC7AF6E',
          },
          RoleArn: {
            'Fn::GetAtt': [
              'ProvidedTargetRole8CFDD54A',
              'Arn',
            ],
          },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        ],
      },
      Roles: [{
        Ref: 'ProvidedTargetRole8CFDD54A',
      }],
    });
  });

  test('reuses IAM role and IAM policy for two schedulers from the same account', () => {
    const target = new SnsPublish(topic);

    new scheduler.Schedule(stack, 'Schedule1', {
      schedule: scheduleExpression,
      target,
    });

    new scheduler.Schedule(stack, 'Schedule2', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::Scheduler::Schedule', 2);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
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
          },
        ],
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        ],
      },
      Roles: [{
        Ref: roleId,
      }],
    });
  });

  test('creates IAM role and IAM policy for two schedules with the same target but different groups', () => {
    const target = new SnsPublish(topic);
    const group = new Group(stack, 'Group', {
      groupName: 'mygroup',
    });

    new scheduler.Schedule(stack, 'Schedule1', {
      schedule: scheduleExpression,
      target,
    });

    new scheduler.Schedule(stack, 'Schedule2', {
      schedule: scheduleExpression,
      target,
      group,
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::Scheduler::Schedule', 2);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
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
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        ],
      },
      Roles: [{
        Ref: roleId,
      }],
    });
  });

  test('creates IAM policy for imported sns topic in the same account', () => {
    const importedTopic = sns.Topic.fromTopicArn(stack, 'ImportedTopic', 'arn:aws:sns:us-east-1:123456789012:my-topic');

    const target = new SnsPublish(importedTopic);

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: 'arn:aws:sns:us-east-1:123456789012:my-topic',
          RoleArn: {
            'Fn::GetAtt': [
              'SchedulerRoleForTarget54a476A35D62A2', 'Arn',
            ],
          },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: 'arn:aws:sns:us-east-1:123456789012:my-topic',
          },
        ],
      },
      Roles: [{
        Ref: 'SchedulerRoleForTarget54a476A35D62A2',
      }],
    });
  });

  test('creates IAM policy for imported role for sns topic in the same account', () => {
    const importedRole = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/my-role');

    const target = new SnsPublish(topic, {
      role: importedRole,
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'TopicBFC7AF6E',
          },
          RoleArn: 'arn:aws:iam::123456789012:role/my-role',
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        ],
      },
      Roles: ['my-role'],
    });
  });

  test('creates IAM policy for imported sns topic with imported IAM role in the same account', () => {
    const importedTopic = sns.Topic.fromTopicArn(stack, 'ImportedTopic', 'arn:aws:sns:us-east-1:123456789012:my-topic');
    const importedRole = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/my-role');

    const target = new SnsPublish(importedTopic, {
      role: importedRole,
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: 'arn:aws:sns:us-east-1:123456789012:my-topic',
          RoleArn: 'arn:aws:iam::123456789012:role/my-role',
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: 'arn:aws:sns:us-east-1:123456789012:my-topic',
          },
        ],
      },
      Roles: ['my-role'],
    });
  });

  test('adds permissions to execution role for sending messages to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DeadLetterQueue');

    const target = new SnsPublish(topic, {
      deadLetterQueue: dlq,
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
          {
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['DeadLetterQueue9F481546', 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    });
  });

  test('adds permission to execution role when imported DLQ is in same account', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:my-queue');

    const target = new SnsPublish(topic, {
      deadLetterQueue: importedQueue,
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
          {
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: importedQueue.queueArn,
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    });
  });

  test('renders expected retry policy', () => {
    const target = new SnsPublish(topic, {
      retryAttempts: 5,
      maxEventAge: Duration.hours(3),
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'TopicBFC7AF6E',
          },
          RoleArn: {
            'Fn::GetAtt': [roleId, 'Arn'],
          },
          RetryPolicy: {
            MaximumEventAgeInSeconds: 3600 * 3,
            MaximumRetryAttempts: 5,
          },
        },
      },
    });
  });

  test('throws when retry policy max age is more than 1 day', () => {
    const target = new SnsPublish(topic, {
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduleExpression,
        target,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 1 minute', () => {
    const target = new SnsPublish(topic, {
      maxEventAge: Duration.seconds(59),
    });

    expect(() =>
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduleExpression,
        target,
      })).toThrow(/Minimum event age is 1 minute/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const target = new SnsPublish(topic, {
      retryAttempts: 200,
    });

    expect(() =>
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduleExpression,
        target,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });
});
