import { Template } from '../../assertions';
import * as cloudwatch from '../../aws-cloudwatch';
import * as sns from '../../aws-sns';
import { Stack } from '../../core';
import * as actions from '../lib';

test('can use topic as alarm action', () => {
  // GIVEN
  const stack = new Stack();
  const topic = new sns.Topic(stack, 'Topic');
  const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
    metric: new cloudwatch.Metric({ namespace: 'AWS', metricName: 'Henk' }),
    evaluationPeriods: 3,
    threshold: 100,
  });

  // WHEN
  alarm.addAlarmAction(new actions.SnsAction(topic));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
    AlarmActions: [
      { Ref: 'TopicBFC7AF6E' },
    ],
  });
});
