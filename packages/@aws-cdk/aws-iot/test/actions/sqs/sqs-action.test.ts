import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { TopicRule, SqsAction } from '../../../lib';

test('Default SQS action', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const queue = new sqs.Queue(stack, 'MyQueue');
  const action = new SqsAction(queue);
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Sqs: {
            QueueUrl: { Ref: 'MyQueueE6CA6235' },
            UseBase64: false,
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

  const queue = new sqs.Queue(stack, 'MyQueue');
  const action = new SqsAction(queue);
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

test('Default policy for sending message to SQS Queue', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const queue = new sqs.Queue(stack, 'MyQueue');
  const action = new SqsAction(queue);
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sqs:SendMessage',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'MyQueueE6CA6235',
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

test('Can set useBase64', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const queue = new sqs.Queue(stack, 'MyQueue');
  const action = new SqsAction(queue, {
    useBase64: true,
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Sqs: {
            QueueUrl: { Ref: 'MyQueueE6CA6235' },
            UseBase64: true,
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

  const role = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
  });
  const queue = new sqs.Queue(stack, 'MyQueue');
  const action = new SqsAction(queue, { role });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Sqs: {
            QueueUrl: { Ref: 'MyQueueE6CA6235' },
            UseBase64: false,
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

test('Add role to a policy for sending message to SQS Queue', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const role = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
  });
  const queue = new sqs.Queue(stack, 'MyQueue');
  const action = new SqsAction(queue, { role });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sqs:SendMessage',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'MyQueueE6CA6235',
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
