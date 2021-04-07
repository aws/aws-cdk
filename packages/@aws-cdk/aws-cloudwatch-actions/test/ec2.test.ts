import '@aws-cdk/assert-internal/jest';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Stack } from '@aws-cdk/core';
import * as actions from '../lib';

test('can use instance reboot as alarm action', () => {
  // GIVEN
  const stack = new Stack();
  const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
    metric: new cloudwatch.Metric({
      namespace: 'AWS/EC2',
      metricName: 'StatusCheckFailed',
      dimensions: {
        InstanceId: 'i-03cb889aaaafffeee',
      },
    }),
    evaluationPeriods: 3,
    threshold: 100,
  });

  // WHEN
  alarm.addAlarmAction(new actions.Ec2Action(actions.Ec2InstanceAction.REBOOT));

  // THEN
  expect(stack).toHaveResource('AWS::CloudWatch::Alarm', {
    AlarmActions: [
      {
        'Fn::Join': [
          '',
          [
            'arn:aws:automate:',
            {
              Ref: 'AWS::Region',
            },
            ':ec2:reboot',
          ],
        ],
      },
    ],
  });
});
