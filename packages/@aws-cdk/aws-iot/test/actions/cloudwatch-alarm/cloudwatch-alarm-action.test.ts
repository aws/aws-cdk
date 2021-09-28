import { Template } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { TopicRule, CloudwatchAlarmAction } from '../../../lib';

test('Default cloudwatch alarm action', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const alarm = new cloudwatch.Alarm(stack, 'MyAlarm', {
    metric: new cloudwatch.Metric({
      namespace: 'test-namespace',
      metricName: 'test-metricName',
    }),
    threshold: 0,
    evaluationPeriods: 1,
  });
  const action = new CloudwatchAlarmAction(alarm, cloudwatch.AlarmState.ALARM);
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          CloudwatchAlarm: {
            AlarmName: { Ref: 'MyAlarm696658B6' },
            StateValue: 'ALARM',
            StateReason: 'This state was set by the rule of AWS IoT Core.',
            RoleArn: {
              'Fn::GetAtt': [
                'MyTopicRuleTopicRuleActionRoleCE2D05DA',
                'Arn',
              ],
            },
          },
        },
      ],
      AwsIotSqlVersion: '2015-10-08',
      RuleDisabled: false,
      Sql: "SELECT topic(2) as device_id FROM 'device/+/data'",
    },
  });
});

test('Default role that assumed by iot.amazonaws.com', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const alarm = new cloudwatch.Alarm(stack, 'MyAlarm', {
    metric: new cloudwatch.Metric({
      namespace: 'test-namespace',
      metricName: 'test-metricName',
    }),
    threshold: 0,
    evaluationPeriods: 1,
  });
  const action = new CloudwatchAlarmAction(alarm, cloudwatch.AlarmState.ALARM);
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'iot.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('Default policy for setting alarm state', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const alarm = new cloudwatch.Alarm(stack, 'MyAlarm', {
    metric: new cloudwatch.Metric({
      namespace: 'test-namespace',
      metricName: 'test-metricName',
    }),
    threshold: 0,
    evaluationPeriods: 1,
  });
  const action = new CloudwatchAlarmAction(alarm, cloudwatch.AlarmState.ALARM);
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'cloudwatch:SetAlarmState',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'MyAlarm696658B6',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'MyTopicRuleTopicRuleActionRoleDefaultPolicy54A701F7',
    Roles: [
      { Ref: 'MyTopicRuleTopicRuleActionRoleCE2D05DA' },
    ],
  });
});

test('Can set state reason', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const alarm = new cloudwatch.Alarm(stack, 'MyAlarm', {
    metric: new cloudwatch.Metric({
      namespace: 'test-namespace',
      metricName: 'test-metricName',
    }),
    threshold: 0,
    evaluationPeriods: 1,
  });
  const action = new CloudwatchAlarmAction(alarm, cloudwatch.AlarmState.ALARM, {
    stateReason: 'test-stateReason',
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          CloudwatchAlarm: {
            AlarmName: { Ref: 'MyAlarm696658B6' },
            StateValue: 'ALARM',
            StateReason: 'test-stateReason',
            RoleArn: {
              'Fn::GetAtt': [
                'MyTopicRuleTopicRuleActionRoleCE2D05DA',
                'Arn',
              ],
            },
          },
        },
      ],
      AwsIotSqlVersion: '2015-10-08',
      RuleDisabled: false,
      Sql: "SELECT topic(2) as device_id FROM 'device/+/data'",
    },
  });
});

test('Can set role', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const alarm = new cloudwatch.Alarm(stack, 'MyAlarm', {
    metric: new cloudwatch.Metric({
      namespace: 'test-namespace',
      metricName: 'test-metricName',
    }),
    threshold: 0,
    evaluationPeriods: 1,
  });
  const role = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
  });

  const action = new CloudwatchAlarmAction(alarm, cloudwatch.AlarmState.ALARM, {
    role,
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          CloudwatchAlarm: {
            AlarmName: { Ref: 'MyAlarm696658B6' },
            StateValue: 'ALARM',
            StateReason: 'This state was set by the rule of AWS IoT Core.',
            RoleArn: {
              'Fn::GetAtt': [
                'MyRoleF48FFE04',
                'Arn',
              ],
            },
          },
        },
      ],
      AwsIotSqlVersion: '2015-10-08',
      RuleDisabled: false,
      Sql: "SELECT topic(2) as device_id FROM 'device/+/data'",
    },
  });
});

test('Add role to a policy for setting alarm state', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const alarm = new cloudwatch.Alarm(stack, 'MyAlarm', {
    metric: new cloudwatch.Metric({
      namespace: 'test-namespace',
      metricName: 'test-metricName',
    }),
    threshold: 0,
    evaluationPeriods: 1,
  });
  const role = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
  });

  const action = new CloudwatchAlarmAction(alarm, cloudwatch.AlarmState.ALARM, {
    role,
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'cloudwatch:SetAlarmState',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'MyAlarm696658B6',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'MyRoleDefaultPolicyA36BE1DD',
    Roles: [
      { Ref: 'MyRoleF48FFE04' },
    ],
  });
});
