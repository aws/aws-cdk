import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { TopicRule, CloudwatchMetricAction } from '../../../lib';

test('Default cloudwatch metric action', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id, namespace, unit, value, timestamp FROM 'device/+/data'" },
  });

  const action = new CloudwatchMetricAction({
    metricName: '${topic(2)}',
    metricNamespace: '${namespace}',
    metricUnit: '${unit}',
    metricValue: '${value}',
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          CloudwatchMetric: {
            MetricName: '${topic(2)}',
            MetricNamespace: '${namespace}',
            MetricUnit: '${unit}',
            MetricValue: '${value}',
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
      Sql: "SELECT topic(2) as device_id, namespace, unit, value, timestamp FROM 'device/+/data'",
    },
  });
});

test('Default role that assumed by iot.amazonaws.com', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id, namespace, unit, value, timestamp FROM 'device/+/data'" },
  });

  const action = new CloudwatchMetricAction({
    metricName: '${topic(2)}',
    metricNamespace: '${namespace}',
    metricUnit: '${unit}',
    metricValue: '${value}',
  });
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

test('Default policy for capturing metric', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id, namespace, unit, value, timestamp FROM 'device/+/data'" },
  });

  const action = new CloudwatchMetricAction({
    metricName: '${topic(2)}',
    metricNamespace: '${namespace}',
    metricUnit: '${unit}',
    metricValue: '${value}',
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'cloudwatch:PutMetricData',
          Effect: 'Allow',
          Resource: '*',
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

test('Can set timestamp', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id, namespace, unit, value, timestamp FROM 'device/+/data'" },
  });

  const action = new CloudwatchMetricAction({
    metricName: '${topic(2)}',
    metricNamespace: '${namespace}',
    metricUnit: '${unit}',
    metricValue: '${value}',
    metricTimestamp: '${timestamp}',
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          CloudwatchMetric: {
            MetricName: '${topic(2)}',
            MetricNamespace: '${namespace}',
            MetricUnit: '${unit}',
            MetricValue: '${value}',
            MetricTimestamp: '${timestamp}',
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
      Sql: "SELECT topic(2) as device_id, namespace, unit, value, timestamp FROM 'device/+/data'",
    },
  });
});

test('Can set role', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id, namespace, unit, value, timestamp FROM 'device/+/data'" },
  });

  const role = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
  });
  const action = new CloudwatchMetricAction({
    metricName: '${topic(2)}',
    metricNamespace: '${namespace}',
    metricUnit: '${unit}',
    metricValue: '${value}',
    role,
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          CloudwatchMetric: {
            MetricName: '${topic(2)}',
            MetricNamespace: '${namespace}',
            MetricUnit: '${unit}',
            MetricValue: '${value}',
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
      Sql: "SELECT topic(2) as device_id, namespace, unit, value, timestamp FROM 'device/+/data'",
    },
  });
});

test('Add role to a policy for capturing metric', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id, namespace, unit, value, timestamp FROM 'device/+/data'" },
  });

  const role = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
  });
  const action = new CloudwatchMetricAction({
    metricName: '${topic(2)}',
    metricNamespace: '${namespace}',
    metricUnit: '${unit}',
    metricValue: '${value}',
    role,
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'cloudwatch:PutMetricData',
          Effect: 'Allow',
          Resource: '*',
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
