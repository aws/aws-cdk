import { Schedule, ScheduleExpression, ScheduleTargetInput } from '@aws-cdk/aws-scheduler-alpha';
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

  beforeEach(() => {
    app = new App();
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
    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {});

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
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
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

  test('reuses IAM role and IAM policy for two schedules from the same account', () => {
    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {});

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
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    }, 1);
  });

  test('creates IAM policy for imported eventBus in the same account', () => {
    const importedEventBusArn = 'arn:aws:events:us-east-1:123456789012:event-bus/MyEventBus';
    const importedEventBus = events.EventBus.fromEventBusArn(stack, 'ImportedEventBus', importedEventBusArn);
    const entry: EventBridgePutEventsEntry = {
      ...eventBusEventEntry,
      eventBus: importedEventBus,
    };

    const eventBusTarget = new EventBridgePutEvents(entry, {});

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

  test('throws when eventBus is imported from different account', () => {
    const anotherAccountId = '123456789015';
    const importedEventBusArnFromAnotherAccount = `arn:aws:events:us-east-1:${anotherAccountId}:event-bus/MyEventBus`;
    const importedEventBus = events.EventBus.fromEventBusArn(stack, 'ImportedEventBus', importedEventBusArnFromAnotherAccount);
    const entry: EventBridgePutEventsEntry = {
      ...eventBusEventEntry,
      eventBus: importedEventBus,
    };
    const eventBusTarget = new EventBridgePutEvents(entry, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: eventBusTarget,
      })).toThrow(/Both the schedule and the eventBus must be in the same account./);
  });

  test('throws when eventBus is imported from different region', () => {
    const anotherRegion = 'eu-central-1';
    const importedEventBusArnFromAnotherRegion = `arn:aws:events:${anotherRegion}:123456789012:event-bus/MyEventBus`;
    const importedEventBus = events.EventBus.fromEventBusArn(stack, 'ImportedEventBus', importedEventBusArnFromAnotherRegion);
    const entry: EventBridgePutEventsEntry = {
      ...eventBusEventEntry,
      eventBus: importedEventBus,
    };
    const eventBusTarget = new EventBridgePutEvents(entry, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: eventBusTarget,
      })).toThrow(/Both the schedule and the eventBus must be in the same region/);
  });

  test('throws when IAM role is imported from different account', () => {
    const anotherAccountId = '123456789015';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', `arn:aws:iam::${anotherAccountId}:role/someRole`);

    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      role: importedRole,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: eventBusTarget,
      })).toThrow(/Both the target and the execution role must be in the same account/);
  });

  test('adds permissions to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: eventBusTarget,
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

    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      deadLetterQueue: queue,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: eventBusTarget,
      })).toThrow(/Both the queue and the schedule must be in the same region./);
  });

  test('does not create a queue policy when DLQ is imported', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');

    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: eventBusTarget,
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

    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      deadLetterQueue: queue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: eventBusTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::SQS::QueuePolicy', 0);
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
    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: eventBusTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 15 minutes', () => {
    const eventBusTarget = new EventBridgePutEvents(eventBusEventEntry, {
      maxEventAge: Duration.minutes(5),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: eventBusTarget,
      })).toThrow(/Minimum event age is 15 minutes/);
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
