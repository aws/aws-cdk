import '@aws-cdk/assert-internal/jest';
import * as chatbot from '@aws-cdk/aws-chatbot';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as notifications from '../lib';
import {
  FakeCodeBuild,
  FakeCodePipeline,
  FakeIncorrectResource,
} from './helpers';

describe('NotificationRule', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('created new notification rule', () => {
    const project = new FakeCodeBuild();
    const topic = new sns.Topic(stack, 'MyTopic');
    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackChannelConfigurationName: 'test-channel',
      slackWorkspaceId: 'T49239U4W', // modify to your slack workspace id
      slackChannelId: 'C0187JABUE9', // modify to your slack channel id
      loggingLevel: chatbot.LoggingLevel.NONE,
    });

    new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PROJECT_BUILD_STATE_FAILED,
      ],
      source: project,
      targets: [
        new notifications.SnsTopicNotificationTarget(topic),
        new notifications.SlackNotificationTarget(slackChannel),
      ],
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
      ],
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      Targets: [
        {
          TargetAddress: {
            Ref: 'MyTopic86869434',
          },
          TargetType: 'SNS',
        },
        {
          TargetAddress: {
            Ref: 'MySlackChannelA8E0B56C',
          },
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });

  test('created new notification rule with status DISABLED', () => {
    const project = new FakeCodeBuild();
    const topic = new sns.Topic(stack, 'MyTopic');

    new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PROJECT_BUILD_STATE_FAILED,
      ],
      source: project,
      targets: [
        new notifications.SnsTopicNotificationTarget(topic),
      ],
      status: notifications.Status.DISABLED,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
      ],
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      Targets: [
        {
          TargetAddress: {
            Ref: 'MyTopic86869434',
          },
          TargetType: 'SNS',
        },
      ],
      Status: 'DISABLED',
    });
  });

  test('should throw error if source events are invalid with CodeBuild ProjectEvent', () => {
    const project = new FakeCodeBuild();
    const topic = new sns.Topic(stack, 'MyTopic');

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PIPELINE_PIPELINE_EXECUTION_SUCCEEDED,
      ],
      source: project,
      targets: [
        new notifications.SnsTopicNotificationTarget(topic),
      ],
    })).toThrow(
      /codepipeline-pipeline-pipeline-execution-succeeded event id is not valid in CodeBuild/,
    );
  });

  test('should throw error if source events are invalid with CodePipeline PipelineEvent', () => {
    const pipeline = new FakeCodePipeline();
    const topic = new sns.Topic(stack, 'MyTopic');

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
      ],
      source: pipeline,
      targets: [
        new notifications.SnsTopicNotificationTarget(topic),
      ],
    })).toThrow(
      /codebuild-project-build-state-succeeded event id is not valid in CodePipeline/,
    );
  });

  test('should throws error if source events are not provided', () => {
    const project = new FakeCodeBuild();
    const topic = new sns.Topic(stack, 'MyTopic');

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [],
      source: project,
      targets: [
        new notifications.SnsTopicNotificationTarget(topic),
      ],
    })).toThrowError('"events" property must set at least 1 event');
  });

  test('notification added targets', () => {
    const project = new FakeCodeBuild();
    const target1 = new sns.Topic(stack, 'MyTopic1', {});
    const target2 = new sns.Topic(stack, 'MyTopic2', {});
    const target3 = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackChannelConfigurationName: 'MySlackChannel',
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
    });

    const rule = new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PROJECT_BUILD_STATE_FAILED,
      ],
      targets: [],
      source: project,
    });

    rule.addTarget(new notifications.SnsTopicNotificationTarget(target1));
    rule.addTarget(new notifications.SnsTopicNotificationTarget(target2));
    rule.addTarget(new notifications.SlackNotificationTarget(target3));

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
      ],
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      Targets: [
        {
          TargetAddress: {
            Ref: 'MyTopic13BD94FE8',
          },
          TargetType: 'SNS',
        },
        {
          TargetAddress: {
            Ref: 'MyTopic288CE2107',
          },
          TargetType: 'SNS',
        },
        {
          TargetAddress: {
            Ref: 'MySlackChannelA8E0B56C',
          },
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });

  test('should throws error if source is invalid', () => {
    const someResource = new FakeIncorrectResource();
    const topic = new sns.Topic(stack, 'MyTopic');

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED],
      // @ts-ignore
      source: someResource,
      targets: [
        new notifications.SnsTopicNotificationTarget(topic),
      ],
    })).toThrowError('"source" property must have "projectArn" or "pipelineArn"');
  });

  test('from notification rule ARN', () => {
    const imported = notifications.Rule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
    expect(imported.ruleArn).toEqual('arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
  });
});