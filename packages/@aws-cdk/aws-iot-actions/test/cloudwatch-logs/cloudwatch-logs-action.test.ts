import { Template, Match } from '@aws-cdk/assertions';
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
  const logGroup = logs.LogGroup.fromLogGroupArn(stack, 'my-log-group', 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group');

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
            LogGroupName: 'my-log-group',
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
          Resource: 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group:*',
        },
        {
          Action: 'logs:DescribeLogStreams',
          Effect: 'Allow',
          Resource: 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group:*',
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
  const logGroup = logs.LogGroup.fromLogGroupArn(stack, 'my-log-group', 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group');
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
        Match.objectLike({ CloudwatchLogs: { RoleArn: 'arn:aws:iam::123456789012:role/ForTest' } }),
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyName: 'MyRolePolicy64AB00A5',
    Roles: ['ForTest'],
  });
});

test('When multiple actions are omitted role property, the actions use same one role', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const logGroup1 = logs.LogGroup.fromLogGroupArn(stack, 'my-log-group1', 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group1');
  const logGroup2 = logs.LogGroup.fromLogGroupArn(stack, 'my-log-group2', 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group2');

  // WHEN
  topicRule.addAction(new actions.CloudWatchLogsAction(logGroup1));
  topicRule.addAction(new actions.CloudWatchLogsAction(logGroup2));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          CloudwatchLogs: {
            LogGroupName: 'my-log-group1',
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
            LogGroupName: 'my-log-group2',
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
