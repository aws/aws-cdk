import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as iot from '../lib';

test('Default property', () => {
  const stack = new cdk.Stack();

  new TopicRule(stack, 'MyTopicRule', {
    sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [],
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test('Can get topic rule name', () => {
  const stack = new cdk.Stack();
  const rule = new TopicRule(stack, 'MyTopicRule', {
    sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
  });

  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      TopicRuleName: rule.topicRuleName,
    },
  });

  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    TopicRuleName: { Ref: 'MyTopicRule4EC2091C' },
  });
});

test('Can get topic rule arn', () => {
  const stack = new cdk.Stack();
  const rule = new TopicRule(stack, 'MyTopicRule', {
    sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
  });

  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      TopicRuleArn: rule.topicRuleArn,
    },
  });

  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    TopicRuleArn: {
      'Fn::GetAtt': ['MyTopicRule4EC2091C', 'Arn'],
    },
  });
});

test('Can set physical name', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new TopicRule(stack, 'MyTopicRule', {
    topicRuleName: 'PhysicalName',
    sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    RuleName: 'PhysicalName',
  });
});

test('Can set actions', () => {
  const stack = new cdk.Stack();

  const action1: IAction = {
    bind: () => ({
      configuration: {
        http: { url: 'http://example.com' },
      },
    }),
  };
  const action2: IAction = {
    bind: () => ({
      configuration: {
        lambda: { functionArn: 'test-functionArn' },
      },
    }),
  };

  new TopicRule(stack, 'MyTopicRule', {
    sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    actions: [action1, action2],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Http: { Url: 'http://example.com' },
        },
        {
          Lambda: { FunctionArn: 'test-functionArn' },
        },
      ],
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test('Can add actions', () => {
  const stack = new cdk.Stack();

  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
  });
  topicRule.addAction({
    bind: () => ({
      configuration: {
        http: { url: 'http://example.com' },
      },
    }),
  });
  topicRule.addAction({
    bind: () => ({
      configuration: {
        lambda: { functionArn: 'test-functionArn' },
      },
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Http: { Url: 'http://example.com' },
        },
        {
          Lambda: { FunctionArn: 'test-functionArn' },
        },
      ],
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test('Can not set empty query', () => {
  const stack = new cdk.Stack();

  expect(() => new TopicRule(stack, 'MyTopicRule', {
    sql: '',
  })).toThrowError(
    'sql cannot be empty.',
  );
});

test('Can not add actions have no action property', () => {
  const stack = new cdk.Stack();

  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
  });
  const emptyAction: IAction = {
    bind: () => ({
      configuration: {},
    }),
  };

  expect(() => topicRule.addAction(emptyAction)).toThrowError(
    'Empty actions are not allowed. Please define one type of action',
  );
});

test('Can not add actions have multiple action properties', () => {
  const stack = new cdk.Stack();

  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
  });
  const multipleAction: IAction = {
    bind: () => ({
      configuration: {
        http: { url: 'http://example.com' },
        lambda: { functionArn: 'test-functionArn' },
      },
    }),
  };

  expect(() => topicRule.addAction(multipleAction)).toThrowError(
    'Each object in the actions list can only have one action defined. keys: http,lambda',
  );
});

test('Can import from topic rule arn', () => {
  const stack = new cdk.Stack();

  const topicRuleArn = 'arn:aws:iot:ap-northeast-1:123456789012:rule/my-rule-name';

  const topicRule = TopicRule.fromTopicRuleArn(stack, 'TopicRuleFromArn', topicRuleArn);

  expect(topicRule).toMatchObject({
    topicRuleArn,
    topicRuleName: 'my-rule-name',
  });
});

test('Can not import if invalid topic rule arn', () => {
  const stack = new cdk.Stack();

  const topicRuleArn = 'arn:aws:iot:ap-northeast-1:123456789012:rule/';

  expect(() => TopicRule.fromTopicRuleArn(stack, 'TopicRuleFromArn', topicRuleArn)).toThrowError(
    'Invalid topic rule arn: topicRuleArn has no resource name.',
  );
});
