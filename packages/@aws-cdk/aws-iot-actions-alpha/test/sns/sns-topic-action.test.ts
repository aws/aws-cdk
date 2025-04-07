import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as iot from '@aws-cdk/aws-iot-alpha';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as actions from '../../lib';

const SNS_TOPIC_ARN = 'arn:aws:sns::123456789012:test-topic';

let stack: cdk.Stack;
let topicRule: iot.TopicRule;
let snsTopic: sns.ITopic;

beforeEach(() => {
  stack = new cdk.Stack();
  topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  snsTopic = sns.Topic.fromTopicArn(stack, 'MySnsTopic', SNS_TOPIC_ARN);
});

test('Default SNS topic action', () => {
  // WHEN
  topicRule.addAction(new actions.SnsTopicAction(snsTopic));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [{
        Sns: {
          RoleArn: { 'Fn::GetAtt': ['MyTopicRuleTopicRuleActionRoleCE2D05DA', 'Arn'] },
          TargetArn: SNS_TOPIC_ARN,
        },
      }],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'iot.amazonaws.com' },
      }],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: 'sns:Publish',
        Effect: 'Allow',
        Resource: SNS_TOPIC_ARN,
      }],
    },
    Roles: [{ Ref: 'MyTopicRuleTopicRuleActionRoleCE2D05DA' }],
  });
});

test('Can set messageFormat', () => {
  // WHEN
  topicRule.addAction(new actions.SnsTopicAction(snsTopic, {
    messageFormat: actions.SnsActionMessageFormat.JSON,
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ Sns: { MessageFormat: 'JSON' } }),
      ],
    },
  });
});

test('Can set role', () => {
  // GIVEN
  const roleArn = 'arn:aws:iam::123456789012:role/testrole';
  const role = iam.Role.fromRoleArn(stack, 'MyRole', roleArn);

  // WHEN
  topicRule.addAction(new actions.SnsTopicAction(snsTopic, {
    role,
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ Sns: { RoleArn: roleArn } }),
      ],
    },
  });
});

test('Action with FIFO topic throws error', () => {
  // GIVEN
  const snsFifoTopic = sns.Topic.fromTopicArn(stack, 'MyFifoTopic', `${SNS_TOPIC_ARN}.fifo`);

  expect(() => {
    topicRule.addAction(new actions.SnsTopicAction(snsFifoTopic));
  }).toThrow('IoT Rule actions cannot be used with FIFO SNS Topics, please pass a non-FIFO Topic instead');
});
