import { Template, Match } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

test('Default SQS queue action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const queue = sqs.Queue.fromQueueArn(stack, 'MyQueue', 'arn:aws:sqs::123456789012:test-queue');

  // WHEN
  topicRule.addAction(new actions.SqsQueueAction(queue));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Sqs: {
            QueueUrl: {
              'Fn::Join': ['', [
                'https://sqs..',
                { Ref: 'AWS::URLSuffix' },
                '/123456789012/test-queue',
              ]],
            },
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
          Action: 'sqs:SendMessage',
          Effect: 'Allow',
          Resource: 'arn:aws:sqs::123456789012:test-queue',
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

test('Can set useBase64', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const queue = sqs.Queue.fromQueueArn(stack, 'MyQueue', 'arn:aws:sqs::123456789012:test-queue');

  // WHEN
  topicRule.addAction(new actions.SqsQueueAction(queue, {
    useBase64: true,
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ Sqs: { UseBase64: true } }),
      ],
    },
  });
});

test('Can set role', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const queue = sqs.Queue.fromQueueArn(stack, 'MyQueue', 'arn:aws:sqs::123456789012:test-queue');
  const role = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::123456789012:role/ForTest');

  // WHEN
  topicRule.addAction(new actions.SqsQueueAction(queue, { role }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({
          Sqs: {
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
