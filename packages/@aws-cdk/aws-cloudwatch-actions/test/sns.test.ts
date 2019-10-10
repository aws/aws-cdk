import '@aws-cdk/assert/jest';
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import sns = require('@aws-cdk/aws-sns');
import { Stack } from '@aws-cdk/core';
import actions = require('../lib');

test('can use topic as alarm action', () => {
  // GIVEN
  const stack = new Stack();
  const topic = new sns.Topic(stack, 'Topic');
  const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
    metric: new cloudwatch.Metric({ namespace: 'AWS', metricName: 'Henk' }),
    evaluationPeriods: 3,
    threshold: 100
  });

  // WHEN
  alarm.addAlarmAction(new actions.SnsAction(topic));

  // THEN
  expect(stack).toHaveResource('AWS::CloudWatch::Alarm', {
    AlarmActions: [
      { Ref: "TopicBFC7AF6E" }
    ],
  });
});
