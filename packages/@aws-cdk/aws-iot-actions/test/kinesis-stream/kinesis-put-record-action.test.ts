import { Template, Match } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as kinesis from '@aws-cdk/aws-kinesis';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

test('Default kinesis stream action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const stream = kinesis.Stream.fromStreamArn(stack, 'MyStream', 'arn:aws:kinesis:xx-west-1:111122223333:stream/my-stream');

  // WHEN
  topicRule.addAction(new actions.KinesisPutRecordAction(stream, {
    partitionKey: '${newuuid()}',
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Kinesis: {
            StreamName: 'my-stream',
            PartitionKey: '${newuuid()}',
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
          Action: 'kinesis:PutRecord',
          Effect: 'Allow',
          Resource: 'arn:aws:kinesis:xx-west-1:111122223333:stream/my-stream',
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

test('passes undefined to partitionKey if empty string is given', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const stream = kinesis.Stream.fromStreamArn(stack, 'MyStream', 'arn:aws:kinesis:xx-west-1:111122223333:stream/my-stream');

  // WHEN
  topicRule.addAction(new actions.KinesisPutRecordAction(stream, {
    partitionKey: '',
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ Kinesis: { PartitionKey: Match.absent() } }),
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
  const stream = kinesis.Stream.fromStreamArn(stack, 'MyStream', 'arn:aws:kinesis:xx-west-1:111122223333:stream/my-stream');
  const role = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::123456789012:role/ForTest');

  // WHEN
  topicRule.addAction(new actions.KinesisPutRecordAction(stream, {
    partitionKey: '${newuuid()}',
    role,
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ Kinesis: { RoleArn: 'arn:aws:iam::123456789012:role/ForTest' } }),
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyName: 'MyRolePolicy64AB00A5',
    Roles: ['ForTest'],
  });
});
