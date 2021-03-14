import '@aws-cdk/assert/jest';
import * as iot from '@aws-cdk/aws-iot';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import { Stack } from '@aws-cdk/core';
import * as actions from '../lib';

let stack: Stack;
let rule: iot.TopicRule;

test('add lambda action', () => {
  stack = new Stack();
  rule = new iot.TopicRule(stack, 'TopicRule', {
    sql: 'SELECT * FROM \'topic/subtopic\'',
  });
  const fn = new lambda.Function(stack, 'Function', {
    code: lambda.Code.fromInline('boom'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_8_10,
  });

  rule.addAction(new actions.Lambda({
    function: fn,
  }));

  expect(stack).toHaveResourceLike('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Lambda: { FunctionArn: { 'Fn::GetAtt': ['Function76856677', 'Arn'] } },
        },
      ],
      RuleDisabled: false,
      Sql: 'SELECT * FROM \'topic/subtopic\'',
    },
  });

  expect(stack).toHaveResourceLike('AWS::Lambda::Permission', {
    Action: 'lambda:InvokeFunction',
    FunctionName: {
      'Fn::GetAtt': [
        'Function76856677',
        'Arn',
      ],
    },
    Principal: 'iot.amazonaws.com',
    SourceAccount: {
      Ref: 'AWS::AccountId',
    },
  });
});
test('add sns action', () => {
  stack = new Stack();
  rule = new iot.TopicRule(stack, 'PublishSnsRule', {
    sql: 'SELECT * FROM \'topic/subtopic\'',
  });
  const topic = new sns.Topic(stack, 'MyTopic');

  rule.addAction(new actions.Sns({
    topic: topic,
  }));

  expect(stack).toHaveResourceLike('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Sns: {
            MessageFormat: 'RAW',
            RoleArn: { 'Fn::GetAtt': ['PublishSnsRuleAllowIot34A25A9A', 'Arn'] },
            TargetArn: { Ref: 'MyTopic86869434' },
          },
        },
      ],
      RuleDisabled: false,
      Sql: 'SELECT * FROM \'topic/subtopic\'',
    },
  });
});
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
});
