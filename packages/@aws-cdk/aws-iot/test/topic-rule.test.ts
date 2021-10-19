import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as iot from '../lib';

test('Default property', () => {
  const stack = new cdk.Stack();

  new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
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
  const rule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
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
  const rule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
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
  new iot.TopicRule(stack, 'MyTopicRule', {
    topicRuleName: 'PhysicalName',
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    RuleName: 'PhysicalName',
  });
});

test('Can set sql as version 2015-10-08', () => {
  const stack = new cdk.Stack();

  new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      AwsIotSqlVersion: '2015-10-08',
    },
  });
});

test('Can set sql as version 2016-03-23', () => {
  const stack = new cdk.Stack();

  new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      AwsIotSqlVersion: '2016-03-23',
    },
  });
});

test('Can set sql as version newest', () => {
  const stack = new cdk.Stack();

  new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVerNewestUnstable("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      AwsIotSqlVersion: 'beta',
    },
  });
});

test('Can set actions', () => {
  const stack = new cdk.Stack();

  const action1: iot.IAction = {
    bind: () => ({
      configuration: {
        http: { url: 'http://example.com' },
      },
    }),
  };
  const action2: iot.IAction = {
    bind: () => ({
      configuration: {
        lambda: { functionArn: 'test-functionArn' },
      },
    }),
  };

  new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
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

  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
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

test('Can not add actions have no action property', () => {
  const stack = new cdk.Stack();

  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });
  const emptyAction: iot.IAction = {
    bind: () => ({
      configuration: {},
    }),
  };

  expect(() => {
    topicRule.addAction(emptyAction);
  }).toThrow('Empty actions are not allowed. Please define one type of action');
});

test('Can not add actions have multiple action properties', () => {
  const stack = new cdk.Stack();

  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });
  const multipleAction: iot.IAction = {
    bind: () => ({
      configuration: {
        http: { url: 'http://example.com' },
        lambda: { functionArn: 'test-functionArn' },
      },
    }),
  };

  expect(() => {
    topicRule.addAction(multipleAction);
  }).toThrow(
    'Each IoT Action can only define a single service it integrates with, received: http,lambda',
  );
});

test('Can import from topic rule arn', () => {
  const stack = new cdk.Stack();

  const topicRuleArn = 'arn:aws:iot:ap-northeast-1:123456789012:rule/my-rule-name';

  const topicRule = iot.TopicRule.fromTopicRuleArn(stack, 'TopicRuleFromArn', topicRuleArn);

  expect(topicRule).toMatchObject({
    topicRuleArn,
    topicRuleName: 'my-rule-name',
  });
});

test('Can not import if invalid topic rule arn', () => {
  const stack = new cdk.Stack();

  const topicRuleArn = 'arn:aws:iot:ap-northeast-1:123456789012:rule/';

  expect(() => {
    iot.TopicRule.fromTopicRuleArn(stack, 'TopicRuleFromArn', topicRuleArn);
  }).toThrow('Invalid topic rule arn: topicRuleArn has no resource name.');
});
