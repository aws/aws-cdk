import { expect, haveResource } from '@aws-cdk/assert';
import * as events from '@aws-cdk/aws-events';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';


test('use log group as an event rule target', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup');
  const rule1 = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  // WHEN
  rule1.addTarget(new targets.LogGroup(logGroup));

  // THEN
  expect(stack).to(haveResource('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 minute)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['MyLogGroup5C0DAD85', 'Arn'] },
        Id: 'Target0',
      },
    ],
  }));
});

test('use log group as an event rule target with rule target input', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup');
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
  expect(stack).to(haveResource('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 minute)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['MyLogGroup5C0DAD85', 'Arn'] },
        Id: 'Target0',
        InputTransformer: {
          InputPathsMap: {
            f1: '$',
          },
          InputTemplate: '{"data":<f1>}',
        },
      },
    ],
  }));
});