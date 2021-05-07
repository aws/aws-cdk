import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as events from '@aws-cdk/aws-events';
import * as sns from '@aws-cdk/aws-sns';
import { Duration, Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

test('sns topic as an event rule target', () => {
  // GIVEN
  const stack = new Stack();
  const topic = new sns.Topic(stack, 'MyTopic');
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SnsTopic(topic));

  // THEN
  expect(stack).to(haveResource('AWS::SNS::TopicPolicy', {
    PolicyDocument: {
      Statement: [
        {
          Sid: '0',
          Action: 'sns:Publish',
          Effect: 'Allow',
          Principal: { Service: 'events.amazonaws.com' },
          Resource: { Ref: 'MyTopic86869434' },
        },
      ],
      Version: '2012-10-17',
    },
    Topics: [{ Ref: 'MyTopic86869434' }],
  }));

  expect(stack).to(haveResource('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: { Ref: 'MyTopic86869434' },
        Id: 'Target0',
      },
    ],
  }));
});

test('multiple uses of a topic as a target results in a single policy statement', () => {
  // GIVEN
  const stack = new Stack();
  const topic = new sns.Topic(stack, 'MyTopic');

  // WHEN
  for (let i = 0; i < 5; ++i) {
    const rule = new events.Rule(stack, `Rule${i}`, {
      schedule: events.Schedule.rate(Duration.hours(1)),
    });
    rule.addTarget(new targets.SnsTopic(topic));
  }

  // THEN
  expect(stack).to(haveResource('AWS::SNS::TopicPolicy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sns:Publish',
          Effect: 'Allow',
          Principal: { Service: 'events.amazonaws.com' },
          Resource: { Ref: 'MyTopic86869434' },
          Sid: '0',
        },
      ],
      Version: '2012-10-17',
    },
    Topics: [{ Ref: 'MyTopic86869434' }],
  }));
});
