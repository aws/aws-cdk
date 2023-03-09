import { Template } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Stack } from '@aws-cdk/core';
import * as actions from '../lib';

test('can use ssm with critical severity and performance category as alarm action', () => {
  // GIVEN
  const stack = new Stack();
  const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
    metric: new cloudwatch.Metric({
      namespace: 'AWS',
      metricName: 'Test',
    }),
    evaluationPeriods: 3,
    threshold: 100,
  });

  // WHEN
  alarm.addAlarmAction(new actions.SsmAction(actions.OpsItemSeverity.CRITICAL, actions.OpsItemCategory.PERFORMANCE));

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
            ':ssm:',
            {
              Ref: 'AWS::Region',
            },
            ':',
            {
              Ref: 'AWS::AccountId',
            },
            ':opsitem:1#CATEGORY=Performance',
          ],
        ],
      },
    ],
  });
});


test('can use ssm with medium severity and no category as alarm action', () => {
  // GIVEN
  const stack = new Stack();
  const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
    metric: new cloudwatch.Metric({
      namespace: 'AWS',
      metricName: 'Test',
    }),
    evaluationPeriods: 3,
    threshold: 100,
  });

  // WHEN
  alarm.addAlarmAction(new actions.SsmAction(actions.OpsItemSeverity.MEDIUM));

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
            ':ssm:',
            {
              Ref: 'AWS::Region',
            },
            ':',
            {
              Ref: 'AWS::AccountId',
            },
            ':opsitem:3',
          ],
        ],
      },
    ],
  });
});

test('can use SSM Incident as alarm action', () => {
  // GIVEN
  const stack = new Stack();
  const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
    metric: new cloudwatch.Metric({ namespace: 'AWS', metricName: 'Test' }),
    evaluationPeriods: 3,
    threshold: 100,
  });

  // WHEN
  const responsePlanName = 'ResponsePlanName';
  alarm.addAlarmAction(new actions.SsmIncidentAction(responsePlanName));

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
            ':ssm-incidents::',
            {
              Ref: 'AWS::AccountId',
            },
            ':response-plan/ResponsePlanName',
          ],
        ],
      },
    ],
  });
});

