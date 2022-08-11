import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

let stack: cdk.Stack;
let topicRule: iot.TopicRule;
let input: iotevents.IInput;

beforeEach(() => {
  stack = new cdk.Stack();
  topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  input = iotevents.Input.fromInputName(stack, 'MyInput', 'my_input');
});


test('Default IoT Events input action', () => {
  // WHEN
  topicRule.addAction(
    new actions.IotEventsPutMessageAction(input),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          IotEvents: {
            InputName: 'my_input',
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
          Action: 'iotevents:BatchPutMessage',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':iotevents:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':input/my_input',
              ],
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

test('can set batchMode', () => {
  // WHEN
  topicRule.addAction(
    new actions.IotEventsPutMessageAction(input, { batchMode: true }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [{ IotEvents: { BatchMode: true } }],
    },
  });
});

test('can set messageId', () => {
  // WHEN
  topicRule.addAction(
    new actions.IotEventsPutMessageAction(input, { messageId: '${topic()}-${timestamp()}' }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [{ IotEvents: { MessageId: '${topic()}-${timestamp()}' } }],
    },
  });
});

test('can set role', () => {
  const role = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::123456789012:role/ForTest');

  // WHEN
  topicRule.addAction(
    new actions.IotEventsPutMessageAction(input, { role }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [{ IotEvents: { RoleArn: 'arn:aws:iam::123456789012:role/ForTest' } }],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyName: 'MyRolePolicy64AB00A5',
    Roles: ['ForTest'],
  });
});

test('cannot set both batchMode and messageId', () => {
  expect(() => {
    new actions.IotEventsPutMessageAction(input, {
      batchMode: true,
      messageId: '${topic()}-${timestamp()}',
    });
  }).toThrow('messageId is not allowed when batchMode is true');
});
