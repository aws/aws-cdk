import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as notifications from '../lib';
import {
  FakeCodeBuild,
  FakeCodePipeline,
  FakeIncorrectResource,
  FakeSnsTopicTarget,
  FakeSlackTarget,
} from './helpers';

describe('NotificationRule', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('created new notification rule', () => {
    const project = new FakeCodeBuild();
    const topic = new FakeSnsTopicTarget();
    const slack = new FakeSlackTarget();

    new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PROJECT_BUILD_STATE_FAILED,
      ],
      source: project,
      targets: [
        topic,
        slack,
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
          TargetAddress: 'arn:aws:sns::1234567890:MyTopic',
          TargetType: 'SNS',
        },
        {
          TargetAddress: 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/MySlackChannel',
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });

  test('created new notification rule with status DISABLED', () => {
    const project = new FakeCodeBuild();
    const topic = new FakeSnsTopicTarget();

    new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PROJECT_BUILD_STATE_FAILED,
      ],
      source: project,
      targets: [
        topic,
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
          TargetAddress: 'arn:aws:sns::1234567890:MyTopic',
          TargetType: 'SNS',
        },
      ],
      Status: 'DISABLED',
    });
  });

  test('should throw error if source events are invalid with CodeBuild ProjectEvent', () => {
    const project = new FakeCodeBuild();
    const topic = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PIPELINE_PIPELINE_EXECUTION_SUCCEEDED,
      ],
      source: project,
      targets: [
        topic,
      ],
    })).toThrow(
      /codepipeline-pipeline-pipeline-execution-succeeded event id is not valid in CodeBuild/,
    );
  });

  test('should throw error if source events are invalid with CodePipeline PipelineEvent', () => {
    const pipeline = new FakeCodePipeline();
    const topic = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
      ],
      source: pipeline,
      targets: [
        topic,
      ],
    })).toThrow(
      /codebuild-project-build-state-succeeded event id is not valid in CodePipeline/,
    );
  });

  test('should throws error if source events are not provided', () => {
    const project = new FakeCodeBuild();
    const topic = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [],
      source: project,
      targets: [
        topic,
      ],
    })).toThrowError('"events" property must set at least 1 event');
  });

  test('should throws error if source is invalid', () => {
    const someResource = new FakeIncorrectResource();
    const topic = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED],
      // @ts-ignore
      source: someResource,
      targets: [
        topic,
      ],
    })).toThrowError('"source" property must have "projectArn" or "pipelineArn"');
  });

  test('should throws error if target is invalid', () => {
    const pipeline = new FakeCodePipeline();
    const someResource = new FakeIncorrectResource();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [notifications.Event.PIPELINE_ACTION_EXECUTION_SUCCEEDED,],
      source: pipeline,
      targets: [
        // @ts-ignore
        someResource,
      ],
    })).toThrowError('"target" property must have "topicArn" or "slackChannelConfigurationArn"');
  });

  test('from notification rule ARN', () => {
    const imported = notifications.Rule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
    expect(imported.ruleArn).toEqual('arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
  });
});