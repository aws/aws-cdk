import { Construct } from 'constructs';
import { Template } from '../../assertions';
import { AccountRootPrincipal, Role } from '../../aws-iam';
import * as firehose from '../../aws-kinesisfirehose';
import { ScheduleGroup, ScheduleExpression, Schedule } from '../../aws-scheduler';
import * as sqs from '../../aws-sqs';
import { App, CfnResource, Duration, Stack } from '../../core';

import { FirehosePutRecord } from '../lib';

describe('schedule target', () => {
  let app: App;
  let stack: Stack;
  let firehoseStream: firehose.DeliveryStream;
  let dependable: Construct;
  let mockS3Destination: firehose.IDestination;

  const bucketArn = 'arn:aws:s3:::my-bucket';
  const roleArn = 'arn:aws:iam::111122223333:role/my-role';

  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));
  const firehoseStreamId = 'MyFirehoseFCA2F9D3';
  const roleId = 'SchedulerRoleForTarget047201570CF076';

  beforeEach(() => {
    app = new App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } });
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    mockS3Destination = {
      bind(scope: Construct, _options: firehose.DestinationBindOptions): firehose.DestinationConfig {
        dependable = new class extends Construct {
          constructor(depScope: Construct, id: string) {
            super(depScope, id);
            new CfnResource(this, 'Resource', { type: 'CDK::Dummy' });
          }
        }(scope, 'Dummy Dep');
        return {
          extendedS3DestinationConfiguration: {
            bucketArn: bucketArn,
            roleArn: roleArn,
          },
          dependables: [dependable],
        };
      },
    };
    firehoseStream = new firehose.DeliveryStream(stack, 'MyFirehose', {
      destination: mockS3Destination,
    });
  });

  test('creates IAM role and IAM policy for Amazon Data Firehose target in the same account', () => {
    const firehoseTarget = new FirehosePutRecord(firehoseStream);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: firehoseTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': [firehoseStreamId, 'Arn'],
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
              'Fn::GetAtt': [firehoseStreamId, 'Arn'],
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

    const firehoseTarget = new FirehosePutRecord(firehoseStream, {
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
            'Fn::GetAtt': [firehoseStreamId, 'Arn'],
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
              'Fn::GetAtt': [firehoseStreamId, 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules with the same target from the same account', () => {
    const firehoseTarget = new FirehosePutRecord(firehoseStream);

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
              'Fn::GetAtt': [firehoseStreamId, 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    }, 1);
  });

  test('creates IAM role and IAM policy for two schedules with the same target but different groups', () => {
    const firehoseTarget = new FirehosePutRecord(firehoseStream);
    const group = new ScheduleGroup(stack, 'Group', {
      scheduleGroupName: 'mygroup',
    });

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: firehoseTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: firehoseTarget,
      scheduleGroup: group,
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
              'Fn::GetAtt': [firehoseStreamId, 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    }, 1);
  });

  test('creates IAM policy for firehose in another stack with the same account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '123456789012',
      },
    });
    const anotherFirehose = new firehose.DeliveryStream(stack2, 'AnotherFirehose', {
      destination: mockS3Destination,
    });

    const firehoseTarget = new FirehosePutRecord(anotherFirehose);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: firehoseTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherFirehose028A8805Arn2409390E',
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTargetd57ce0DB208927', 'Arn'] },
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
              'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherFirehose028A8805Arn2409390E',
            },
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTargetd57ce0DB208927' }],
    });
  });

  test('creates IAM policy for imported role for firehose in the same account', () => {
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const firehoseTarget = new FirehosePutRecord(firehoseStream, {
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
            'Fn::GetAtt': [firehoseStreamId, 'Arn'],
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
              'Fn::GetAtt': [firehoseStreamId, 'Arn'],
            },
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for firehose in another stack with imported IAM role in the same account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '123456789012',
      },
    });
    const anotherFirehose = new firehose.DeliveryStream(stack2, 'AnotherFirehose', {
      destination: mockS3Destination,
    });
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const firehoseTarget = new FirehosePutRecord(anotherFirehose, {
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
            'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherFirehose028A8805Arn2409390E',
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
              'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherFirehose028A8805Arn2409390E',
            },
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('adds permissions to execution role for sending messages to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const firehoseTarget = new FirehosePutRecord(firehoseStream, {
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
              'Fn::GetAtt': [firehoseStreamId, 'Arn'],
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

    const firehoseTarget = new FirehosePutRecord(firehoseStream, {
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
              'Fn::GetAtt': [firehoseStreamId, 'Arn'],
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
    const firehoseTarget = new FirehosePutRecord(firehoseStream, {
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
            'Fn::GetAtt': [firehoseStreamId, 'Arn'],
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
    const firehoseTarget = new FirehosePutRecord(firehoseStream, {
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: firehoseTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 1 minute', () => {
    const firehoseTarget = new FirehosePutRecord(firehoseStream, {
      maxEventAge: Duration.seconds(59),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: firehoseTarget,
      })).toThrow(/Minimum event age is 1 minute/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const firehoseTarget = new FirehosePutRecord(firehoseStream, {
      retryAttempts: 200,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: firehoseTarget,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });
});
