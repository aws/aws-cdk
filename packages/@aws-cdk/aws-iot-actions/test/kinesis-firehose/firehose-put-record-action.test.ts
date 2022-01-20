import { Template, Match } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

test('Default firehose stream action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const stream = firehose.DeliveryStream.fromDeliveryStreamArn(stack, 'MyStream', 'arn:aws:firehose:xx-west-1:111122223333:deliverystream/my-stream');

  // WHEN
  topicRule.addAction(
    new actions.FirehosePutRecordAction(stream),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Firehose: {
            DeliveryStreamName: 'my-stream',
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
          Action: ['firehose:PutRecord', 'firehose:PutRecordBatch'],
          Effect: 'Allow',
          Resource: 'arn:aws:firehose:xx-west-1:111122223333:deliverystream/my-stream',
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

test('can set batchMode', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const stream = firehose.DeliveryStream.fromDeliveryStreamArn(stack, 'MyStream', 'arn:aws:firehose:xx-west-1:111122223333:deliverystream/my-stream');

  // WHEN
  topicRule.addAction(
    new actions.FirehosePutRecordAction(stream, { batchMode: true }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ Firehose: { BatchMode: true } }),
      ],
    },
  });
});

test('can set separotor', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const stream = firehose.DeliveryStream.fromDeliveryStreamArn(stack, 'MyStream', 'arn:aws:firehose:xx-west-1:111122223333:deliverystream/my-stream');

  // WHEN
  topicRule.addAction(
    new actions.FirehosePutRecordAction(stream, { recordSeparator: actions.FirehoseRecordSeparator.NEWLINE }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ Firehose: { Separator: '\n' } }),
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
  const stream = firehose.DeliveryStream.fromDeliveryStreamArn(stack, 'MyStream', 'arn:aws:firehose:xx-west-1:111122223333:deliverystream/my-stream');
  const role = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::123456789012:role/ForTest');

  // WHEN
  topicRule.addAction(
    new actions.FirehosePutRecordAction(stream, { role }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ Firehose: { RoleArn: 'arn:aws:iam::123456789012:role/ForTest' } }),
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyName: 'MyRolePolicy64AB00A5',
    Roles: ['ForTest'],
  });
});
