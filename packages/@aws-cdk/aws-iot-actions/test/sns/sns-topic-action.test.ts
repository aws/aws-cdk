import { Template } from '@aws-cdk/assertions';
// import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

const SNS_TOPIC_ARN = 'arn:aws:sns::123456789012:test-topic';
const RULE_ROLE_ID = 'MyTopicRuleTopicRuleActionRoleCE2D05DA';

test('Default SNS topic action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const snsTopic = sns.Topic.fromTopicArn(stack, 'MySnsTopic', SNS_TOPIC_ARN);

  // WHEN
  topicRule.addAction(new actions.SnsTopicAction(snsTopic));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Sns: {
            RoleArn: {
              'Fn::GetAtt': [
                RULE_ROLE_ID,
                'Arn',
              ],
            },
            TargetArn: SNS_TOPIC_ARN,
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
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sns:Publish',
          Effect: 'Allow',
          Resource: SNS_TOPIC_ARN,
        },
      ],
    },
    Roles: [
      { Ref: RULE_ROLE_ID },
    ],
  });
});