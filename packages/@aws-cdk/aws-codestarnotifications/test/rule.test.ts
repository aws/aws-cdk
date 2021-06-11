import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as notifications from '../lib';
import {
  FakeCodeBuild,
  FakeCodePipeline,
  FakeSlackTarget,
  FakeSnsTopicTarget,
} from './helpers';

describe('Rule', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('created new notification rule with source', () => {
    const project = new FakeCodeBuild();

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      source: project,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
    });
  });

  test('created new notification rule with all parameters in constructor props', () => {
    const project = new FakeCodeBuild();
    const slack = new FakeSlackTarget();

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      detailType: notifications.DetailType.FULL,
      events: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
      ],
      source: project,
      target: slack,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'MyNotificationRule',
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
      ],
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      Targets: [
        {
          TargetAddress: 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/MySlackChannel',
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });

  test('created new notification rule without name and will generate from the `id`', () => {
    new notifications.NotificationRule(stack, 'MyNotificationRuleGeneratedFromId', {
      source: new FakeCodeBuild(),
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'MyNotificationRuleGeneratedFromId',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
    });
  });

  test('generating name will cut if id length is over than 64 charts', () => {
    const project = new FakeCodeBuild();

    new notifications.NotificationRule(stack, 'MyNotificationRuleGeneratedFromIdIsToooooooooooooooooooooooooooooLong', {
      source: project,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'ificationRuleGeneratedFromIdIsToooooooooooooooooooooooooooooLong',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
    });
  });

  test('created new notification rule without detailType', () => {
    const project = new FakeCodeBuild();

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      source: project,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
    });
  });

  test('created new notification rule with status DISABLED', () => {
    const project = new FakeCodeBuild();

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      source: project,
      enabled: false,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      Status: 'DISABLED',
    });
  });

  test('created new notification rule with status ENABLED', () => {
    const project = new FakeCodeBuild();

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      source: project,
      enabled: true,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      Status: 'ENABLED',
    });
  });

  test('notification added targets', () => {
    const project = new FakeCodeBuild();
    const topic = new FakeSnsTopicTarget();
    const slack = new FakeSlackTarget();

    const rule = new notifications.NotificationRule(stack, 'MyNotificationRule', {
      source: project,
    });

    rule.addTarget(slack);

    expect(rule.addTarget(topic)).toEqual(true);

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      Targets: [
        {
          TargetAddress: 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/MySlackChannel',
          TargetType: 'AWSChatbotSlack',
        },
        {
          TargetAddress: 'arn:aws:sns::1234567890:MyTopic',
          TargetType: 'SNS',
        },
      ],
    });
  });

  test('will not effect and return false when added targets if notification from imported', () => {
    const imported = notifications.NotificationRule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
    const slack = new FakeSlackTarget();
    expect(imported.addTarget(slack)).toEqual(false);
  });

  test('will not add if notification added duplicating event', () => {
    const pipeline = new FakeCodePipeline();
    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      source: pipeline,
      events: [
        'codepipeline-pipeline-pipeline-execution-succeeded',
        'codepipeline-pipeline-pipeline-execution-failed',
        'codepipeline-pipeline-pipeline-execution-succeeded',
        'codepipeline-pipeline-pipeline-execution-canceled',
      ],
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Resource: 'arn:aws:codepipeline::1234567890:MyCodepipelineProject',
      EventTypeIds: [
        'codepipeline-pipeline-pipeline-execution-succeeded',
        'codepipeline-pipeline-pipeline-execution-failed',
        'codepipeline-pipeline-pipeline-execution-canceled',
      ],
    });
  });

  test('from notification rule ARN', () => {
    const imported = notifications.NotificationRule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
    expect(imported.notificationRuleArn).toEqual('arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
  });

  test('from notification rule ARN', () => {
    const imported = notifications.NotificationRule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
    expect(imported.notificationRuleArn).toEqual('arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
  });
});