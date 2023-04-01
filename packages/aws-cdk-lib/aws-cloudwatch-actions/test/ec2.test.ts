import { Template } from '../../assertions';
import * as cloudwatch from '../../aws-cloudwatch';
import { Stack } from '../../core';
import * as actions from '../lib';

test('can use instance reboot as alarm action', () => {
  // GIVEN
  const stack = new Stack();
  const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
    metric: new cloudwatch.Metric({
      namespace: 'AWS/EC2',
      metricName: 'StatusCheckFailed',
      dimensionsMap: {
        InstanceId: 'i-03cb889aaaafffeee',
      },
    }),
    evaluationPeriods: 3,
    threshold: 100,
  });

  // WHEN
  alarm.addAlarmAction(new actions.Ec2Action(actions.Ec2InstanceAction.REBOOT));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
    AlarmActions: [
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':automate:',
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
