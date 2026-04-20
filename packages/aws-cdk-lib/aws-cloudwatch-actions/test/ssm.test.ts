import { Template } from '../../assertions';
import * as cloudwatch from '../../aws-cloudwatch';
import * as kms from '../../aws-kms';
import * as ssmIncidents from '../../aws-ssmincidents';
import * as cdk from '../../core';
import { Stack } from '../../core';
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

test('SSM Incident alarm action with full stack including replication set and response plan', () => {
  // This test covers the scenario from the integ test integ.ssm-incident-alarm-action,
  // which can no longer be deployed because CreateReplicationSet API was deprecated
  // on Nov 7, 2025 (SSM Incident Manager is no longer open to new customers).

  // GIVEN
  const stack = new Stack();
  const responsePlanName = 'test-response-plan';

  const key = new kms.Key(stack, 'Key', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });
  const replicationSet = new ssmIncidents.CfnReplicationSet(stack, 'ReplicationSet', {
    deletionProtected: false,
    regions: [{
      regionName: stack.region,
      regionConfiguration: {
        sseKmsKeyId: key.keyArn,
      },
    }],
  });

  const responsePlan = new ssmIncidents.CfnResponsePlan(stack, 'ResponsePlan', {
    name: responsePlanName,
    incidentTemplate: {
      title: 'Incident Title',
      impact: 1,
    },
  });
  responsePlan.node.addDependency(replicationSet);

  const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
    metric: new cloudwatch.Metric({ namespace: 'CDK/Test', metricName: 'Metric' }),
    threshold: 100,
    evaluationPeriods: 3,
  });
  alarm.node.addDependency(responsePlan);

  // WHEN
  alarm.addAlarmAction(new actions.SsmIncidentAction(responsePlanName));

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::SSMIncidents::ReplicationSet', {
    DeletionProtected: false,
  });
  template.hasResourceProperties('AWS::SSMIncidents::ResponsePlan', {
    Name: 'test-response-plan',
    IncidentTemplate: {
      Title: 'Incident Title',
      Impact: 1,
    },
  });
  template.hasResourceProperties('AWS::CloudWatch::Alarm', {
    AlarmActions: [
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':ssm-incidents::',
            { Ref: 'AWS::AccountId' },
            ':response-plan/test-response-plan',
          ],
        ],
      },
    ],
  });
});

