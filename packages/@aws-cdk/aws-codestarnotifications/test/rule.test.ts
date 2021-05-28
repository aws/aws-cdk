import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as notifications from '../lib';
import {
  FakeCodeBuild,
  FakeCodePipeline,
  FakeSnsTopicTarget,
  FakeSlackTarget,
} from './helpers';

describe('NotificationRule', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('created new notification rule', () => {
    const codeBuildSource = new FakeCodeBuild();
    const snsTopicTarget = new FakeSnsTopicTarget();
    const slackTarget = new FakeSlackTarget();

    new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
      events: [
        notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
        notifications.ProjectEvent.BUILD_STATE_FAILED,
      ],
      source: codeBuildSource,
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
    const codeBuildSource = new FakeCodeBuild();
    const snsTopicTarget = new FakeSnsTopicTarget();

    new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
      events: [
        notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
        notifications.ProjectEvent.BUILD_STATE_FAILED,
      ],
      source: codeBuildSource,
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
    const codeBuildSource = new FakeCodeBuild();
    const snsTopicTarget = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
      events: [
        notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
        notifications.PipelineEvent.PIPELINE_EXECUTION_SUCCEEDED,
      ],
      source: codeBuildSource,
      targets: [
        snsTopicTarget,
      ],
    })).toThrow(
      /codepipeline-pipeline-pipeline-execution-succeeded event id is not valid in CodeBuild/,
    );
  });

  test('should throw error if source events are invalid with CodePipeline PipelineEvent', () => {
    const codepiPelineSource = new FakeCodePipeline();
    const snsTopicTarget = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
      events: [
        notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
      ],
      source: codepiPelineSource,
      targets: [
        snsTopicTarget,
      ],
    })).toThrow(
      /codebuild-project-build-state-succeeded event id is not valid in CodePipeline/,
    );
  });

  test('should throws error if source events are not provided', () => {
    const codeBuildSource = new FakeCodeBuild();
    const snsTopicTarget = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
      events: [],
      source: codeBuildSource,
      targets: [
        snsTopicTarget,
      ],
    })).toThrowError('"events" property must set at least 1 event');
  });

  test('from notification rule ARN', () => {
    const imported = notifications.Rule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
    expect(imported.ruleArn).toEqual('arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
  });
});