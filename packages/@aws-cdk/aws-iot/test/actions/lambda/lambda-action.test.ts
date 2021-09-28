import { Template } from '@aws-cdk/assertions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { TopicRule, LambdaAction } from '../../../lib';

test('Have topic rule resource that include lambda action', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const lambdaFn = new lambda.Function(stack, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('console.log("foo")'),
  });
  const action = new LambdaAction(lambdaFn);
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Lambda: {
            FunctionArn: {
              'Fn::GetAtt': [
                'MyFunction3BAA72D1',
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

test('Have lambda permission resource to invoked by IoT Rule', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const lambdaFn = new lambda.Function(stack, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('console.log("foo")'),
  });
  const action = new LambdaAction(lambdaFn);
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
    Action: 'lambda:InvokeFunction',
    FunctionName: {
      'Fn::GetAtt': [
        'MyFunction3BAA72D1',
        'Arn',
      ],
    },
    Principal: 'iot.amazonaws.com',
    SourceAccount: { Ref: 'AWS::AccountId' },
    SourceArn: {
      'Fn::GetAtt': [
        'MyTopicRule4EC2091C',
        'Arn',
      ],
    },
  });
});
