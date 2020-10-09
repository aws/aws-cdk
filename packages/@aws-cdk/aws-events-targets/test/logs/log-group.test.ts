import '@aws-cdk/assert/jest';
import * as events from '@aws-cdk/aws-events';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';


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
  rule1.addTarget(new targets.LogGroup(logGroup));

  // THEN
  expect(stack).toHaveResource('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 minute)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:aws:logs:',
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


test.only('log group used as an event rule target must have a name starting with "/aws/events/"', () => {
  // GIVEN
  const logGroupName = '/awdss/events/MyLogGroup';
  const stack = new cdk.Stack();

  const rule1 = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  // WHEN
  let addTargetWrapper = () => {
    rule1.addTarget(new targets.LogGroup(logs.LogGroup.fromLogGroupName(stack, 'MyLogGroupImported', logGroupName)));
  };

  // THEN
  expect(addTargetWrapper).toThrowError('Target LogGroup name must start with "/aws/events/"');
});

test('use log group as an event rule target with rule target input', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
    logGroupName: '/aws/events/MyLogGroup',
  });
  const rule1 = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  // WHEN
  rule1.addTarget(new targets.LogGroup(logGroup, {
    event: events.RuleTargetInput.fromObject({
      data: events.EventField.fromPath('$'),
    }),
  }));

  // THEN
  expect(stack).toHaveResource('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 minute)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:aws:logs:',
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
            f1: '$',
          },
          InputTemplate: '{"data":<f1>}',
        },
      },
    ],
  });
});
