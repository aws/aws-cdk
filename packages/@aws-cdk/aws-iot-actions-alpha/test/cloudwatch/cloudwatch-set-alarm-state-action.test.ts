import { Template, Match } from 'aws-cdk-lib/assertions';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as iot from '@aws-cdk/aws-iot-alpha';
import * as cdk from 'aws-cdk-lib';
import * as actions from '../../lib';

test('Default cloudwatch alarm action', () => {
  // Given
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, stateReason, stateValue FROM 'device/+/data'"),
  });
  const alarm = cloudwatch.Alarm.fromAlarmArn(stack, 'MyAlarm', 'arn:aws:cloudwatch:us-east-1:123456789012:alarm:MyAlarm');

  // When
  topicRule.addAction(new actions.CloudWatchSetAlarmStateAction(alarm, {
    reason: 'Test reason',
    alarmStateToSet: cloudwatch.AlarmState.ALARM,
  }));

  // Then
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          CloudwatchAlarm: {
            AlarmName: 'MyAlarm',
            RoleArn: {
              'Fn::GetAtt': ['MyTopicRuleTopicRuleActionRoleCE2D05DA', 'Arn'],
            },
            StateReason: 'Test reason',
            StateValue: cloudwatch.AlarmState.ALARM,
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
          Action: 'cloudwatch:SetAlarmState',
          Effect: 'Allow',
          Resource: alarm.alarmArn,
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'MyTopicRuleTopicRuleActionRoleDefaultPolicy54A701F7',
    Roles: [{ Ref: 'MyTopicRuleTopicRuleActionRoleCE2D05DA' }],
  });
});

test('can set role', () => {
  // Given
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, stateReason, stateValue FROM 'device/+/data'"),
  });

  // When
  topicRule.addAction(new actions.CloudWatchSetAlarmStateAction(
    cloudwatch.Alarm.fromAlarmArn(stack, 'MyAlarm', 'arn:aws:cloudwatch:us-east-1:123456789012:alarm:MyAlarm'),
    {
      reason: '${stateReason}',
      alarmStateToSet: cloudwatch.AlarmState.ALARM,
      role: iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::123456789012:role/ForTest'),
    },
  ));

  // Then
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ CloudwatchAlarm: { RoleArn: 'arn:aws:iam::123456789012:role/ForTest' } }),
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyName: 'MyRolePolicy64AB00A5',
    Roles: ['ForTest'],
  });
});

test('set default reason', () => {
  // Given
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, stateReason, stateValue FROM 'device/+/data'"),
  });
  const alarm = cloudwatch.Alarm.fromAlarmArn(stack, 'MyAlarm', 'arn:aws:cloudwatch:us-east-1:123456789012:alarm:MyAlarm');

  // When
  topicRule.addAction(new actions.CloudWatchSetAlarmStateAction(alarm, {
    alarmStateToSet: cloudwatch.AlarmState.ALARM,
  }));

  // Then
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          CloudwatchAlarm: {
            AlarmName: 'MyAlarm',
            RoleArn: {
              'Fn::GetAtt': ['MyTopicRuleTopicRuleActionRoleCE2D05DA', 'Arn'],
            },
            StateReason: "Set state of 'MyAlarm' to 'ALARM'",
            StateValue: cloudwatch.AlarmState.ALARM,
          },
        },
      ],
    },
  });
});
