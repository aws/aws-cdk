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

test('can get topic rule name', () => {
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });

  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      TopicRuleName: topicRule.topicRuleName,
    },
  });

  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    TopicRuleName: { Ref: 'MyTopicRule4EC2091C' },
  });
});

test('can get topic rule arn', () => {
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });

  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      TopicRuleArn: topicRule.topicRuleArn,
    },
  });

  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    TopicRuleArn: {
      'Fn::GetAtt': ['MyTopicRule4EC2091C', 'Arn'],
    },
  });
});

test('can set physical name', () => {
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

test('can set description', () => {
  const stack = new cdk.Stack();

  new iot.TopicRule(stack, 'MyTopicRule', {
    description: 'test-description',
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Description: 'test-description',
    },
  });
});

test('can set ruleDisabled', () => {
  const stack = new cdk.Stack();

  new iot.TopicRule(stack, 'MyTopicRule', {
    enabled: false,
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      RuleDisabled: true,
    },
  });
});

test.each([
  ['fromStringAsVer20151008', iot.IotSql.fromStringAsVer20151008, '2015-10-08'],
  ['fromStringAsVer20160323', iot.IotSql.fromStringAsVer20160323, '2016-03-23'],
  ['fromStringAsVerNewestUnstable', iot.IotSql.fromStringAsVerNewestUnstable, 'beta'],
])('can set sql with using %s', (_, factoryMethod, version) => {
  const stack = new cdk.Stack();

  new iot.TopicRule(stack, 'MyTopicRule', {
    sql: factoryMethod("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      AwsIotSqlVersion: version,
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test.each([
  ['fromStringAsVer20151008', iot.IotSql.fromStringAsVer20151008],
  ['fromStringAsVer20160323', iot.IotSql.fromStringAsVer20160323],
  ['fromStringAsVerNewestUnstable', iot.IotSql.fromStringAsVerNewestUnstable],
])('Using %s fails when setting empty sql', (_, factoryMethod) => {
  expect(() => {
    factoryMethod('');
  }).toThrow('IoT SQL string cannot be empty');
});

test('can set actions', () => {
  const stack = new cdk.Stack();

  const action1: iot.IAction = {
    _bind: () => ({
      configuration: {
        http: { url: 'http://example.com' },
      },
    }),
  };
  const action2: iot.IAction = {
    _bind: () => ({
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
        { Http: { Url: 'http://example.com' } },
        { Lambda: { FunctionArn: 'test-functionArn' } },
      ],
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test('can add an action', () => {
  const stack = new cdk.Stack();

  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });
  topicRule.addAction({
    _bind: () => ({
      configuration: {
        http: { url: 'http://example.com' },
      },
    }),
  });
  topicRule.addAction({
    _bind: () => ({
      configuration: {
        lambda: { functionArn: 'test-functionArn' },
      },
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        { Http: { Url: 'http://example.com' } },
        { Lambda: { FunctionArn: 'test-functionArn' } },
      ],
      Sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    },
  });
});

test('cannot add an action as empty object', () => {
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });

  const emptyKeysAction: iot.IAction = {
    _bind: () => ({
      configuration: {},
    }),
  };

  expect(() => {
    topicRule.addAction(emptyKeysAction);
  }).toThrow('An action property cannot be an empty object.');
});

test('cannot add an action that have multiple keys', () => {
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });

  const multipleKeysAction: iot.IAction = {
    _bind: () => ({
      configuration: {
        http: { url: 'http://example.com' },
        lambda: { functionArn: 'test-functionArn' },
      },
    }),
  };

  expect(() => {
    topicRule.addAction(multipleKeysAction);
  }).toThrow('An action property cannot have multiple keys, received: http,lambda');
});

test('can set errorAction', () => {
  const stack = new cdk.Stack();

  const action: iot.IAction = {
    _bind: () => ({
      configuration: {
        http: { url: 'http://example.com' },
      },
    }),
  };

  new iot.TopicRule(stack, 'MyTopicRule', {
    errorAction: action,
    sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id, temperature FROM 'device/+/data'"),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      ErrorAction: {
        Http: { Url: 'http://example.com' },
      },
    },
  });
});

test('can import a TopicRule by ARN', () => {
  const stack = new cdk.Stack();

  const topicRuleArn = 'arn:aws:iot:ap-northeast-1:123456789012:rule/my-topic-rule-name';

  const topicRule = iot.TopicRule.fromTopicRuleArn(stack, 'TopicRuleFromArn', topicRuleArn);

  expect(topicRule).toMatchObject({
    topicRuleArn,
    topicRuleName: 'my-topic-rule-name',
  });
});

test('fails importing a TopicRule by ARN if the ARN is missing the name of the TopicRule', () => {
  const stack = new cdk.Stack();

  const topicRuleArn = 'arn:aws:iot:ap-northeast-1:123456789012:rule/';

  expect(() => {
    iot.TopicRule.fromTopicRuleArn(stack, 'TopicRuleFromArn', topicRuleArn);
  }).toThrow("Missing topic rule name in ARN: 'arn:aws:iot:ap-northeast-1:123456789012:rule/'");
});
