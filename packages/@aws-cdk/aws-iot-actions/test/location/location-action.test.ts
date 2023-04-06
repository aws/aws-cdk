import * as iot from '@aws-cdk/aws-iot-alpha';
import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as location from 'aws-cdk-lib/aws-location';
import * as actions from '../../lib';

test('Default location action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const tracker = new location.CfnTracker(stack, 'MyTracker', { trackerName: 'myTracker' });

  // WHEN
  topicRule.addAction(
    new actions.LocationAction(tracker, { deviceId: '12345', latitude: '47.6038', longitude: '-122.3301' }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Location: {
            DeviceId: '12345',
            Latitude: '47.6038',
            Longitude: '-122.3301',
            RoleArn: {
              'Fn::GetAtt': ['MyTopicRuleTopicRuleActionRoleCE2D05DA', 'Arn'],
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
          Action: 'geo:BatchUpdateDevicePosition',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': ['MyTracker', 'Arn'],
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

test('can set timestamp of location', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT * FROM 'device/+/data'"),
  });
  const tracker = new location.CfnTracker(stack, 'MyTracker', { trackerName: 'myTracker' });

  // WHEN
  topicRule.addAction(
    new actions.LocationAction(tracker, { deviceId: '${device_id}', latitude: '${latitude}', longitude: '${longitude}', timestamp: { value: '${ts}', unit: actions.LocationTimestampUnit.SECONDS } }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({
          Location: {
            DeviceId: '${device_id}',
            Latitude: '${latitude}',
            Longitude: '${longitude}',
            RoleArn: {
              'Fn::GetAtt': ['MyTopicRuleTopicRuleActionRoleCE2D05DA', 'Arn'],
            },
            Timestamp: {
              Value: '${ts}',
              Unit: actions.LocationTimestampUnit.SECONDS,
            },
          },
        }),
      ],
    },
  });
});

test('can set role', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const tracker = new location.CfnTracker(stack, 'MyTracker', { trackerName: 'myTracker' });

  const role = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::123456789012:role/ForTest');

  // WHEN
  topicRule.addAction(
    new actions.LocationAction(tracker, { deviceId: '12345', latitude: '47.6038', longitude: '-122.3301', role }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({
          Location: {
            DeviceId: '12345',
            Latitude: '47.6038',
            Longitude: '-122.3301',
            RoleArn: 'arn:aws:iam::123456789012:role/ForTest',
          },
        }),
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyName: 'MyRolePolicy64AB00A5',
    Roles: ['ForTest'],
  });
});
