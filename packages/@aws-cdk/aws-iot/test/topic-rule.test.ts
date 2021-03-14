import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { TopicRule, ITopicRuleAction, TopicRuleActionConfig } from '../lib';

nodeunitShim({
  'can create topic rules'(test: Test) {
    // GIVEN
    const stack = new Stack();
    // WHEN
    new TopicRule(stack, 'IotTopicRule', {
      sql: 'SELECT * FROM \'topic/subtopic\'',
      actions: [new DummyAction()],
    });
    // THEN
    expect(stack).to(haveResource('AWS::IoT::TopicRule', {
      TopicRulePayload: {
        Actions: [{
          Republish: {
            RoleArn: 'arn:iam::::role/MyRole',
            Topic: 'topic/subtopic',
          },
        }],
        AwsIotSqlVersion: '2015-10-08',
        Description: '',
        RuleDisabled: false,
        Sql: 'SELECT * FROM \'topic/subtopic\'',
      },
    }));
    test.done();
  },
  'can add role after construction'(test: Test) {
    // GIVEN
    const stack = new Stack();
    // WHEN
    const rule = new TopicRule(stack, 'IotTopicRule', {
      sql: 'SELECT * FROM \'topic/subtopic\'',
    });

    rule.addAction(new DummyAction());

    // THEN
    expect(stack).to(haveResource('AWS::IoT::TopicRule', {
      TopicRulePayload: {
        Actions: [{
          Republish: {
            RoleArn: 'arn:iam::::role/MyRole',
            Topic: 'topic/subtopic',
          },
        }],
        AwsIotSqlVersion: '2015-10-08',
        Description: '',
        RuleDisabled: false,
        Sql: 'SELECT * FROM \'topic/subtopic\'',
      },
    }));
    test.done();
  },
  'from topic rule arn'(test: Test) {
    const stack = new Stack();
    const topicRuleArn = 'arn:aws:iot:::rule/MyTopicRule';
    let topic = TopicRule.fromTopicRuleArn(stack, 'ImportedTopic', topicRuleArn );
    test.deepEqual(topic.ruleName, 'MyTopicRule');
    test.done();
  },
});

class DummyAction implements ITopicRuleAction {
  public bind(): TopicRuleActionConfig {
    return {
      republish: {
        roleArn: 'arn:iam::::role/MyRole',
        topic: 'topic/subtopic',
      },
    };
  };
};

