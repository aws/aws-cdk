import '@aws-cdk/assert/jest';
import * as iot from '@aws-cdk/aws-iot';
import { Stack } from '@aws-cdk/core';
import * as actions from '../../lib';

let stack: Stack;
let rule: iot.TopicRule;

test('add republish action', () => {
  stack = new Stack();
  rule = new iot.TopicRule(stack, 'RepublishRule', {
    sql: 'SELECT * FROM \'topic/subtopic\'',
  });

  rule.addAction(new actions.Republish({
    topic: '$$aws/things/MyThing/shadow/update',
  }));

  expect(stack).toHaveResourceLike('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Republish: {
            Qos: 0,
            RoleArn: { 'Fn::GetAtt': ['RepublishRuleAllowIotB39A8B3C', 'Arn'] },
            Topic: '$$aws/things/MyThing/shadow/update',
          },
        },
      ],
      RuleDisabled: false,
      Sql: 'SELECT * FROM \'topic/subtopic\'',
    },
  });
  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'iot:Publish',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':iot:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':topic/$$aws/things/MyThing/shadow/update',
              ],
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'RepublishRuleAllowIotDefaultPolicy3B0C81B5',
    Roles: [
      { Ref: 'RepublishRuleAllowIotB39A8B3C' },
    ],
  });
});
