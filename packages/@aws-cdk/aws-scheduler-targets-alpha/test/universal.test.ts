import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import { ScheduleGroup } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Annotations, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Universal } from '../lib/universal';

describe('Universal schedule target', () => {
  let app: App;
  let stack: Stack;
  const scheduleExpression = scheduler.ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));
  const roleId = 'SchedulerRoleForTarget5cddf726972933';

  beforeEach(() => {
    app = new App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } });
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('creates IAM role and IAM policy for aws api in the same account', () => {
    const target = new Universal({
      service: 'sqs',
      action: 'createQueue',
      input: scheduler.ScheduleTargetInput.fromObject({
        QueueName: 'my-queue',
      }),
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
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':scheduler:::aws-sdk:sqs:createQueue',
              ],
            ],
          },
          RoleArn: {
            'Fn::GetAtt': [
              'SchedulerRoleForTarget5cddf726972933',
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
            Action: 'sqs:CreateQueue',
            Effect: 'Allow',
            Resource: '*',
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

    Annotations.fromStack(stack).hasWarning(
      '*',
      'Default policy with * for resources is used. Use custom policy for better security posture. [ack: @aws-cdk/aws-scheduler-alpha:defaultWildcardResourcePolicy]',
    );
  });

  test('creates IAM policy for provided IAM role', () => {
    const targetExecutionRole = new iam.Role(stack, 'ProvidedTargetRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    const target = new Universal({
      service: 'sqs',
      action: 'createQueue',
      input: scheduler.ScheduleTargetInput.fromObject({
        QueueName: 'my-queue',
      }),
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
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':scheduler:::aws-sdk:sqs:createQueue',
              ],
            ],
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
            Action: 'sqs:CreateQueue',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: [{
        Ref: 'ProvidedTargetRole8CFDD54A',
      }],
    });
  });

  test('reuses IAM role and IAM policy for two schedulers from the same account', () => {
    const target = new Universal({
      service: 'sqs',
      action: 'createQueue',
      input: scheduler.ScheduleTargetInput.fromObject({
        QueueName: 'my-queue',
      }),
    });

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
            Action: 'sqs:CreateQueue',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: [{
        Ref: roleId,
      }],
    });
  });

  test('creates IAM role and IAM policy for two schedules with the same target but different groups', () => {
    const target = new Universal({
      service: 'sqs',
      action: 'createQueue',
      input: scheduler.ScheduleTargetInput.fromObject({
        QueueName: 'my-queue',
      }),
    });
    const scheduleGroup = new ScheduleGroup(stack, 'ScheduleGroup', {
      scheduleGroupName: 'mygroup',
    });

    new scheduler.Schedule(stack, 'Schedule1', {
      schedule: scheduleExpression,
      target,
    });

    new scheduler.Schedule(stack, 'Schedule2', {
      schedule: scheduleExpression,
      target,
      scheduleGroup,
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
                    'ScheduleGroup4D377372',
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
            Action: 'sqs:CreateQueue',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: [{
        Ref: roleId,
      }],
    });
  });

  test('creates IAM policy for imported role for sns topic in the same account', () => {
    const importedRole = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/my-role');

    const target = new Universal({
      service: 'sqs',
      action: 'createQueue',
      input: scheduler.ScheduleTargetInput.fromObject({
        QueueName: 'my-queue',
      }),
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
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':scheduler:::aws-sdk:sqs:createQueue',
              ],
            ],
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
            Action: 'sqs:CreateQueue',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: ['my-role'],
    });
  });

  test('adds permissions to execution role for sending messages to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DeadLetterQueue');

    const target = new Universal({
      service: 'sqs',
      action: 'createQueue',
      input: scheduler.ScheduleTargetInput.fromObject({
        QueueName: 'my-queue',
      }),
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
            Action: 'sqs:CreateQueue',
            Effect: 'Allow',
            Resource: '*',
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

    const target = new Universal({
      service: 'sqs',
      action: 'createQueue',
      input: scheduler.ScheduleTargetInput.fromObject({
        QueueName: 'my-queue',
      }),
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
            Action: 'sqs:CreateQueue',
            Effect: 'Allow',
            Resource: '*',
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
    const target = new Universal({
      service: 'sqs',
      action: 'createQueue',
      input: scheduler.ScheduleTargetInput.fromObject({
        QueueName: 'my-queue',
      }),
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
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':scheduler:::aws-sdk:sqs:createQueue',
              ],
            ],
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
    const target = new Universal({
      service: 'sqs',
      action: 'createQueue',
      input: scheduler.ScheduleTargetInput.fromObject({
        QueueName: 'my-queue',
      }),
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduleExpression,
        target,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 1 minute', () => {
    const target = new Universal({
      service: 'sqs',
      action: 'createQueue',
      input: scheduler.ScheduleTargetInput.fromObject({
        QueueName: 'my-queue',
      }),
      maxEventAge: Duration.seconds(59),
    });

    expect(() =>
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduleExpression,
        target,
      })).toThrow(/Minimum event age is 1 minute/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const target = new Universal({
      service: 'sqs',
      action: 'createQueue',
      input: scheduler.ScheduleTargetInput.fromObject({
        QueueName: 'my-queue',
      }),
      retryAttempts: 200,
    });

    expect(() =>
      new scheduler.Schedule(stack, 'Schedule', {
        schedule: scheduleExpression,
        target,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });

  test('throws when service is not in lowercase', () => {
    expect(() =>
      new Universal({
        service: 'SQS',
        action: 'createQueue',
        input: scheduler.ScheduleTargetInput.fromObject({
          QueueName: 'my-queue',
        }),
        retryAttempts: 200,
      })).toThrow(/API service must be lowercase, got: SQS/);
  });

  test('throws when action is not in camelCase', () => {
    expect(() =>
      new Universal({
        service: 'sqs',
        action: 'CreateQueue',
        input: scheduler.ScheduleTargetInput.fromObject({
          QueueName: 'my-queue',
        }),
        retryAttempts: 200,
      })).toThrow(/API action must be camelCase, got: CreateQueue/);
  });

  test('throws when action is read-only API', () => {
    expect(() =>
      new Universal({
        service: 'sqs',
        action: 'getQueueUrl',
        input: scheduler.ScheduleTargetInput.fromObject({
          QueueName: 'my-queue',
        }),
        retryAttempts: 200,
      })).toThrow(/Read-only API action is not supported by EventBridge Scheduler: sqs:getQueueUrl/);
  });

  test('specify policyStatements', () => {
    const target = new Universal({
      service: 'sqs',
      action: 'sendMessage',
      policyStatements: [
        new iam.PolicyStatement({
          actions: ['sqs:SendMessage'],
          resources: ['arn:aws:sqs:us-east-1:123456789012:my_queue'],
        }),
        new iam.PolicyStatement({
          actions: ['kms:Decrypt', 'kms:GenerateDataKey*'],
          resources: ['arn:aws:kms:us-east-1:123456789012:key/0987dcba-09fe-87dc-65ba-ab0987654321'],
        }),
      ],
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
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':scheduler:::aws-sdk:sqs:sendMessage',
              ],
            ],
          },
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: 'arn:aws:sqs:us-east-1:123456789012:my_queue',
          },
          {
            Action: ['kms:Decrypt', 'kms:GenerateDataKey*'],
            Effect: 'Allow',
            Resource: 'arn:aws:kms:us-east-1:123456789012:key/0987dcba-09fe-87dc-65ba-ab0987654321',
          },
        ],
      },
    });
  });
});
