import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { TopicRule, IAction, AwsIotSqlVersion } from '../lib';

test('Default property', () => {
  const stack = new cdk.Stack();

  new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: {
      sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [],
      AwsIotSqlVersion: '2015-10-08',
      RuleDisabled: false,
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test('Can get topic rule name', () => {
  const stack = new cdk.Stack();
  const rule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: {
      sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
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
    topicRulePayload: {
      sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
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
    topicRulePayload: {
      sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    RuleName: 'PhysicalName',
  });
});

test('Can set awsIotSqlVersion', () => {
  const stack = new cdk.Stack();

  new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: {
      awsIotSqlVersion: AwsIotSqlVersion.SQL_BETA,
      sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [],
      AwsIotSqlVersion: 'beta',
      RuleDisabled: false,
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test('Can set description', () => {
  const stack = new cdk.Stack();

  new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: {
      description: 'test-description',
      sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [],
      AwsIotSqlVersion: '2015-10-08',
      Description: 'test-description',
      RuleDisabled: false,
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test('Can set ruleDisabled', () => {
  const stack = new cdk.Stack();

  new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: {
      ruleDisabled: true,
      sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [],
      AwsIotSqlVersion: '2015-10-08',
      RuleDisabled: true,
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test('Can set actions', () => {
  const stack = new cdk.Stack();

  const action1: IAction = {
    bind: () => ({
      http: { url: 'http://example.com' },
    }),
  };
  const action2: IAction = {
    bind: () => ({
      lambda: { functionArn: 'test-functionArn' },
    }),
  };

  new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: {
      sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
      actions: [action1, action2],
    },
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
      AwsIotSqlVersion: '2015-10-08',
      RuleDisabled: false,
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test('Can set errorAction', () => {
  const stack = new cdk.Stack();

  const action: IAction = {
    bind: () => ({
      http: { url: 'http://example.com' },
    }),
  };

  new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: {
      sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
      errorAction: action,
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      ErrorAction: {
        Http: { Url: 'http://example.com' },
      },
      Actions: [],
      AwsIotSqlVersion: '2015-10-08',
      RuleDisabled: false,
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test('Can add actions', () => {
  const stack = new cdk.Stack();

  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: {
      sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
  topicRule.addAction({
    bind: () => ({
      http: { url: 'http://example.com' },
    }),
  });
  topicRule.addAction({
    bind: () => ({
      lambda: { functionArn: 'test-functionArn' },
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
      AwsIotSqlVersion: '2015-10-08',
      RuleDisabled: false,
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test('Can not set empty query', () => {
  const stack = new cdk.Stack();

  expect(() => new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: {
      sql: '',
    },
  })).toThrowError(
    '\'topicRulePayload.sql\' cannot be empty.',
  );
});

test('Can not add actions have no action property', () => {
  const stack = new cdk.Stack();

  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: {
      sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
  const emptyAction: IAction = {
    bind: () => ({}),
  };

  expect(() => topicRule.addAction(emptyAction)).toThrowError(
    'Empty actions are not allowed. Please define one type of action',
  );
});

test('Can not add actions have multiple action properties', () => {
  const stack = new cdk.Stack();

  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: {
      sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
  const multipleAction: IAction = {
    bind: () => ({
      http: { url: 'http://example.com' },
      lambda: { functionArn: 'test-functionArn' },
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
