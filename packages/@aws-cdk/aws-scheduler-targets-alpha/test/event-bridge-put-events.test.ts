import { Group, Schedule, ScheduleExpression, ScheduleTargetInput } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as events from 'aws-cdk-lib/aws-events';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { EventBridgePutEvents, EventBridgePutEventsEntry } from '../lib';

describe('eventBridge put events', () => {
  let app: App;
  let stack: Stack;
  let eventBus: events.EventBus;
  let eventBusEventEntry: EventBridgePutEventsEntry;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1991, 2, 24, 0, 0, 0)));
  const roleId = 'SchedulerRoleForTarget1e6d0e3BE2318C';

  beforeEach(() => {
    app = new App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } });
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    eventBus = new events.EventBus(stack, 'MyEventBus', { eventBusName: 'MyEventBus' });
    eventBusEventEntry = {
      eventBus,
      source: 'service',
      detail: ScheduleTargetInput.fromObject({ foo: 'bar' }),
      detailType: 'detailType',
    };
  });

  test('creates IAM role and IAM policy for event bus put events target in the same account', () => {
    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: eventBusTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': [
              'MyEventBus251E60F8',
              'Arn',
            ],
          },
          EventBridgeParameters: {
            DetailType: 'detailType',
            Source: 'service',
          },
          Input: JSON.stringify({ foo: 'bar' }),
          RoleArn: { 'Fn::GetAtt': [roleId, 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:PutEvents',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'MyEventBus251E60F8',
                'Arn',
              ],
            },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
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
    const targetExecutionRole = new Role(stack, 'ProvidedTargetRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      role: targetExecutionRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: eventBusTarget,
    });
    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': [
              'MyEventBus251E60F8',
              'Arn',
            ],
          },

          EventBridgeParameters: {
            DetailType: 'detailType',
            Source: 'service',
          },
          Input: JSON.stringify({ foo: 'bar' }),
          RoleArn: { 'Fn::GetAtt': ['ProvidedTargetRole8CFDD54A', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:PutEvents',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'MyEventBus251E60F8',
                'Arn',
              ],
            },
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules with the same target from the same account', () => {
    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry);

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: eventBusTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: eventBusTarget,
    });

    const template = Template.fromStack(stack);

    template.resourcePropertiesCountIs('AWS::IAM::Role', {
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

    template.resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:PutEvents',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'MyEventBus251E60F8',
                'Arn',
              ],
            },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    }, 1);
  });

  test('creates IAM role and IAM policy for two schedules with the same target but different groups', () => {
    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry);
    const group = new Group(stack, 'Group', {
      groupName: 'mygroup',
    });

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: eventBusTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: eventBusTarget,
      group,
    });

    const template = Template.fromStack(stack);

    template.resourcePropertiesCountIs('AWS::IAM::Role', {
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

    template.resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:PutEvents',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'MyEventBus251E60F8',
                'Arn',
              ],
            },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    }, 1);
  });
  test('creates IAM policy for imported eventBus in the same account', () => {
    const importedEventBusArn = 'arn:aws:events:us-east-1:123456789012:event-bus/MyEventBus';
    const importedEventBus = events.EventBus.fromEventBusArn(stack, 'ImportedEventBus', importedEventBusArn);
    const entry: EventBridgePutEventsEntry = {
      ...eventBusEventEntry,
      eventBus: importedEventBus,
    };

    const eventBusTarget = new EventBridgePutEvents(entry);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: eventBusTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: importedEventBusArn,

          EventBridgeParameters: {
            DetailType: 'detailType',
            Source: 'service',
          },
          Input: JSON.stringify({ foo: 'bar' }),
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget4cff2657666811', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:PutEvents',
            Effect: 'Allow',
            Resource: importedEventBusArn,
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget4cff2657666811' }],
    });
  });

  test('creates IAM policy for imported role for eventBus in the same account', () => {
    const importedRoleArn = 'arn:aws:iam::123456789012:role/someRole';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', importedRoleArn);

    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: eventBusTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': [
              'MyEventBus251E60F8',
              'Arn',
            ],
          },

          EventBridgeParameters: {
            DetailType: 'detailType',
            Source: 'service',
          },
          Input: JSON.stringify({ foo: 'bar' }),
          RoleArn: importedRoleArn,
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:PutEvents',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'MyEventBus251E60F8',
                'Arn',
              ],
            },
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for imported eventBus with imported IAM role in the same account', () => {
    const importedEventBusArn = 'arn:aws:events:us-east-1:123456789012:event-bus/MyEventBus';
    const importedEventBus = events.EventBus.fromEventBusArn(stack, 'ImportedEventBus', importedEventBusArn);
    const importedRoleArn = 'arn:aws:iam::123456789012:role/someRole';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', importedRoleArn);
    const entry: EventBridgePutEventsEntry = {
      ...eventBusEventEntry,
      eventBus: importedEventBus,
    };

    const eventBusTarget = new EventBridgePutEvents(entry, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: eventBusTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: importedEventBusArn,

          EventBridgeParameters: {
            DetailType: 'detailType',
            Source: 'service',
          },
          Input: JSON.stringify({ foo: 'bar' }),
          RoleArn: importedRoleArn,
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:PutEvents',
            Effect: 'Allow',
            Resource: importedEventBusArn,
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('adds permissions to execution role for sending messages to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: eventBusTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:PutEvents',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'MyEventBus251E60F8',
                'Arn',
              ],
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

    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: eventBusTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:PutEvents',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'MyEventBus251E60F8',
                'Arn',
              ],
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
    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      retryAttempts: 5,
      maxEventAge: Duration.hours(3),
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: eventBusTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': [
              'MyEventBus251E60F8',
              'Arn',
            ],
          },
          EventBridgeParameters: {
            DetailType: 'detailType',
            Source: 'service',
          },
          Input: JSON.stringify({ foo: 'bar' }),
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
    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: eventBusTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 1 minute', () => {
    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      maxEventAge: Duration.seconds(59),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: eventBusTarget,
      })).toThrow(/Minimum event age is 1 minute/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      retryAttempts: 200,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: eventBusTarget,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });

  test('throw when input is provided in props', () => {
    expect(() =>
      new EventBridgePutEvents(eventBusEventEntry, {
        input: ScheduleTargetInput.fromObject({ foo: 'bar' }),
      })).toThrow(/ScheduleTargetBaseProps.input is not supported for EventBridgePutEvents. Please use entry.detail instead./);
  });
});
