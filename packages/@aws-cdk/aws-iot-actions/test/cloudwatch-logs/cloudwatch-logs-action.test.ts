import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

test('Default cloudwatch logs action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup');

  // WHEN
  topicRule.addAction(
    new actions.CloudWatchLogsAction(logGroup),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          CloudwatchLogs: {
            LogGroupName: { Ref: 'MyLogGroup5C0DAD85' },
            RoleArn: {
              'Fn::GetAtt': [
                'MyTopicRuleTopicRuleActionRoleCE2D05DA',
                'Arn',
              ],
            },
          },
        },
      ],
    },
  });

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

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': ['MyLogGroup5C0DAD85', 'Arn'],
          },
        },
        {
          Action: 'logs:DescribeLogStreams',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': ['MyLogGroup5C0DAD85', 'Arn'],
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

test('can set role', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup');
  const role = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::123456789012:role/ForTest');

  // WHEN
  topicRule.addAction(
    new actions.CloudWatchLogsAction(logGroup, {
      role,
    }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          CloudwatchLogs: {
            LogGroupName: { Ref: 'MyLogGroup5C0DAD85' },
            RoleArn: 'arn:aws:iam::123456789012:role/ForTest',
          },
        },
      ],
    },
  });
});

test('The specified role is added a policy needed for sending data to logs', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const logGroup = new logs.LogGroup(stack, 'MyLogGroup');
  const role = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::123456789012:role/ForTest');

  // WHEN
  topicRule.addAction(
    new actions.CloudWatchLogsAction(logGroup, {
      role,
    }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': ['MyLogGroup5C0DAD85', 'Arn'],
          },
        },
        {
          Action: 'logs:DescribeLogStreams',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': ['MyLogGroup5C0DAD85', 'Arn'],
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'MyRolePolicy64AB00A5',
    Roles: ['ForTest'],
  });
});


test('When multiple actions are omitted role property, the actions use same one role', () => {
  // GIVEN
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const logGroup1 = new logs.LogGroup(stack, 'MyLogGroup1');
  const logGroup2 = new logs.LogGroup(stack, 'MyLogGroup2');

  // WHEN
  topicRule.addAction(new actions.CloudWatchLogsAction(logGroup1));
  topicRule.addAction(new actions.CloudWatchLogsAction(logGroup2));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          CloudwatchLogs: {
            LogGroupName: { Ref: 'MyLogGroup14A6E382A' },
            RoleArn: {
              'Fn::GetAtt': [
                'MyTopicRuleTopicRuleActionRoleCE2D05DA',
                'Arn',
              ],
            },
          },
        },
        {
          CloudwatchLogs: {
            LogGroupName: { Ref: 'MyLogGroup279D6359D' },
            RoleArn: {
              'Fn::GetAtt': [
                'MyTopicRuleTopicRuleActionRoleCE2D05DA',
                'Arn',
              ],
            },
          },
        },
      ],
    },
  });
});
