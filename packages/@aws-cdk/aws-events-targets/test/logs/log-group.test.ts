import { Template } from '@aws-cdk/assertions';
import * as events from '@aws-cdk/aws-events';
import * as logs from '@aws-cdk/aws-logs';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';
import { LogGroupTargetInput } from '../../lib';


test('use log group as an event rule target', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
    logGroupName: '/aws/events/MyLogGroup',
  });
  const rule1 = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  // WHEN
  rule1.addTarget(new targets.CloudWatchLogGroup(logGroup));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 minute)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':logs:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':log-group:',
              {
                Ref: 'MyLogGroup5C0DAD85',
              },
            ],
          ],
        },
        Id: 'Target0',
      },
    ],
  });
});

test('use log group as an event rule target with rule target input', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app);
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
    logGroupName: '/aws/events/MyLogGroup',
  });
  const rule1 = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  // WHEN
  rule1.addTarget(new targets.CloudWatchLogGroup(logGroup, {
    event: events.RuleTargetInput.fromObject({
      message: events.EventField.fromPath('$'),
    }),
  }));


  // THEN
  expect(() => {
    app.synth();
  }).toThrow(/CloudWatchLogGroup targets only support input templates in the format/);
});

test('cannot use both logEvent and event', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app);
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
    logGroupName: '/aws/events/MyLogGroup',
  });
  const rule1 = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  // THEN
  expect(() => {
    rule1.addTarget(new targets.CloudWatchLogGroup(logGroup, {
      event: events.RuleTargetInput.fromObject({
        message: events.EventField.fromPath('$'),
      }),
      logEvent: LogGroupTargetInput.fromObject(),
    }));
  }).toThrow(/Only one of "event" or "logEvent" can be specified/);
});

test('logEvent with defaults', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
    logGroupName: '/aws/events/MyLogGroup',
  });
  const rule1 = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  // WHEN
  rule1.addTarget(new targets.CloudWatchLogGroup(logGroup, {
    logEvent: LogGroupTargetInput.fromObject(),
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 minute)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':logs:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':log-group:',
              {
                Ref: 'MyLogGroup5C0DAD85',
              },
            ],
          ],
        },
        Id: 'Target0',
        InputTransformer: {
          InputPathsMap: {
            'time': '$.time',
            'detail-type': '$.detail-type',
          },
          InputTemplate: '{"timestamp":<time>,"message":<detail-type>}',
        },
      },
    ],
  });
});

test('can use logEvent', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
    logGroupName: '/aws/events/MyLogGroup',
  });
  const rule1 = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  // WHEN
  rule1.addTarget(new targets.CloudWatchLogGroup(logGroup, {
    logEvent: LogGroupTargetInput.fromObject({
      timestamp: events.EventField.time,
      message: events.EventField.fromPath('$'),
    }),
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 minute)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':logs:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':log-group:',
              {
                Ref: 'MyLogGroup5C0DAD85',
              },
            ],
          ],
        },
        Id: 'Target0',
        InputTransformer: {
          InputPathsMap: {
            time: '$.time',
            f2: '$',
          },
          InputTemplate: '{"timestamp":<time>,"message":<f2>}',
        },
      },
    ],
  });
});

test('specifying retry policy and dead letter queue', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
    logGroupName: '/aws/events/MyLogGroup',
  });
  const rule1 = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  const queue = new sqs.Queue(stack, 'Queue');

  // WHEN
  rule1.addTarget(new targets.CloudWatchLogGroup(logGroup, {
    event: events.RuleTargetInput.fromObject({
      timestamp: events.EventField.time,
      message: events.EventField.fromPath('$'),
    }),
    retryAttempts: 2,
    maxEventAge: cdk.Duration.hours(2),
    deadLetterQueue: queue,
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 minute)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':logs:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':log-group:',
              {
                Ref: 'MyLogGroup5C0DAD85',
              },
            ],
          ],
        },
        DeadLetterConfig: {
          Arn: {
            'Fn::GetAtt': [
              'Queue4A7E3555',
              'Arn',
            ],
          },
        },
        Id: 'Target0',
        InputTransformer: {
          InputPathsMap: {
            time: '$.time',
            f2: '$',
          },
          InputTemplate: '{"timestamp":<time>,"message":<f2>}',
        },
        RetryPolicy: {
          MaximumEventAgeInSeconds: 7200,
          MaximumRetryAttempts: 2,
        },
      },
    ],
  });
});
