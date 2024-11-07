import { ScheduleExpression, Schedule, Group } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { KinesisDataFirehosePutRecord } from '../lib';

describe('schedule target', () => {
  let app: App;
  let stack: Stack;
  let firehose: CfnDeliveryStream;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));
  const roleId = 'SchedulerRoleForTarget380bba149146B2';

  beforeEach(() => {
    app = new App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } });
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    firehose = new CfnDeliveryStream(stack, 'MyFirehose');
  });

  test('creates IAM role and IAM policy for kinesis data firehose target in the same account', () => {
    const firehoseTarget = new KinesisDataFirehosePutRecord(firehose);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: firehoseTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyFirehose', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': [roleId, 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'firehose:PutRecord',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyFirehose', 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
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

    const firehoseTarget = new KinesisDataFirehosePutRecord(firehose, {
      role: targetExecutionRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: firehoseTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyFirehose', 'Arn'],
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
            Action: 'firehose:PutRecord',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyFirehose', 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules with the same target from the same account', () => {
    const firehoseTarget = new KinesisDataFirehosePutRecord(firehose);

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: firehoseTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: firehoseTarget,
    });

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
            Action: 'firehose:PutRecord',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyFirehose', 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    }, 1);
  });

  test('creates IAM role and IAM policy for two schedules with the same target but different groups', () => {
    const firehoseTarget = new KinesisDataFirehosePutRecord(firehose);
    const group = new Group(stack, 'Group', {
      groupName: 'mygroup',
    });

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: firehoseTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: firehoseTarget,
      group,
    });

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
            Action: 'firehose:PutRecord',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyFirehose', 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    }, 1);
  });

  test('creates IAM policy for firehose in the another stack with the same account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '123456789012',
      },
    });
    const anotherFirehose = new CfnDeliveryStream(stack2, 'AnotherFirehose');

    const firehoseTarget = new KinesisDataFirehosePutRecord(anotherFirehose);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: firehoseTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherFirehoseArn24CBF54A',
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget4b70ebDC2428DE', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'firehose:PutRecord',
            Effect: 'Allow',
            Resource: {
              'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherFirehoseArn24CBF54A',
            },
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget4b70ebDC2428DE' }],
    });
  });

  test('creates IAM policy for imported role for firehose in the same account', () => {
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const firehoseTarget = new KinesisDataFirehosePutRecord(firehose, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: firehoseTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyFirehose', 'Arn'],
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
            Action: 'firehose:PutRecord',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyFirehose', 'Arn'],
            },
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for firehose in the another stack with imported IAM role in the same account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '123456789012',
      },
    });
    const anotherFirehose = new CfnDeliveryStream(stack2, 'AnotherFirehose');
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const firehoseTarget = new KinesisDataFirehosePutRecord(anotherFirehose, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: firehoseTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherFirehoseArn24CBF54A',
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
            Action: 'firehose:PutRecord',
            Effect: 'Allow',
            Resource: {
              'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherFirehoseArn24CBF54A',
            },
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('throws when firehose is in the another stack with different account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '234567890123',
      },
    });
    const anotherFirehose = new CfnDeliveryStream(stack2, 'AnotherFirehose');
    const firehoseTarget = new KinesisDataFirehosePutRecord(anotherFirehose);

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: firehoseTarget,
      })).toThrow(/Both the schedule and the Firehose delivery stream must be in the same account/);
  });

  test('throws when firehose is in the another stack with different region', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-west-2',
        account: '123456789012',
      },
    });
    const anotherFirehose = new CfnDeliveryStream(stack2, 'AnotherFirehose');

    const firehoseTarget = new KinesisDataFirehosePutRecord(anotherFirehose);

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: firehoseTarget,
      })).toThrow(/Both the schedule and the Firehose delivery stream must be in the same region/);
  });

  test('throws when IAM role is imported from different account', () => {
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::234567890123:role/someRole');

    const firehoseTarget = new KinesisDataFirehosePutRecord(firehose, {
      role: importedRole,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: firehoseTarget,
      })).toThrow(/Both the target and the execution role must be in the same account/);
  });

  test('adds permissions to execution role for sending messages to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const firehoseTarget = new KinesisDataFirehosePutRecord(firehose, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: firehoseTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'firehose:PutRecord',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyFirehose', 'Arn'],
            },
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
      Roles: [{ Ref: roleId }],
    });
  });

  test('adds permission to execution role when imported DLQ is in same account', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');

    const firehoseTarget = new KinesisDataFirehosePutRecord(firehose, {
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: firehoseTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'firehose:PutRecord',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['MyFirehose', 'Arn'],
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
    const firehoseTarget = new KinesisDataFirehosePutRecord(firehose, {
      retryAttempts: 5,
      maxEventAge: Duration.hours(3),
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: firehoseTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyFirehose', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': [roleId, 'Arn'] },
          RetryPolicy: {
            MaximumEventAgeInSeconds: 10800,
            MaximumRetryAttempts: 5,
          },
        },
      },
    });
  });

  test('throws when retry policy max age is more than 1 day', () => {
    const firehoseTarget = new KinesisDataFirehosePutRecord(firehose, {
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: firehoseTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 15 minutes', () => {
    const firehoseTarget = new KinesisDataFirehosePutRecord(firehose, {
      maxEventAge: Duration.minutes(5),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: firehoseTarget,
      })).toThrow(/Minimum event age is 15 minutes/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const firehoseTarget = new KinesisDataFirehosePutRecord(firehose, {
      retryAttempts: 200,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: firehoseTarget,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });
});
