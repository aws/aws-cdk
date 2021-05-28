import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as notifications from '../lib';
import {
  FakeCodeBuild,
  FakeCodePipeline,
  FakeIncorrectSource,
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
    const snsTopicTarget = new FakeSnsTopicTarget();
    const slackTarget = new FakeSlackTarget();

    new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PROJECT_BUILD_STATE_FAILED,
      ],
      source: project,
      targets: [
        snsTopicTarget,
        slackTarget,
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
    const snsTopicTarget = new FakeSnsTopicTarget();

    new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PROJECT_BUILD_STATE_FAILED,
      ],
      source: project,
      targets: [
        snsTopicTarget,
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
    const snsTopicTarget = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PIPELINE_PIPELINE_EXECUTION_SUCCEEDED,
      ],
      source: project,
      targets: [
        snsTopicTarget,
      ],
    })).toThrow(
      /codepipeline-pipeline-pipeline-execution-succeeded event id is not valid in CodeBuild/,
    );
  });

  test('should throw error if source events are invalid with CodePipeline PipelineEvent', () => {
    const pipeline = new FakeCodePipeline();
    const snsTopicTarget = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
      ],
      source: pipeline,
      targets: [
        snsTopicTarget,
      ],
    })).toThrow(
      /codebuild-project-build-state-succeeded event id is not valid in CodePipeline/,
    );
  });

  test('should throws error if source events are not provided', () => {
    const project = new FakeCodeBuild();
    const snsTopicTarget = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [],
      source: project,
      targets: [
        snsTopicTarget,
      ],
    })).toThrowError('"events" property must set at least 1 event');
  });

  test('should throws error if source is invalid', () => {
    const someResource = FakeIncorrectSource;
    const snsTopicTarget = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [],
      // @ts-ignore
      source: someResource,
      targets: [
        snsTopicTarget,
      ],
    })).toThrowError('"source" property should be type of codebuild.Project or codepipeline.Pipeline');
  });

  test('from notification rule ARN', () => {
    const imported = notifications.Rule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
    expect(imported.ruleArn).toEqual('arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
  });
});