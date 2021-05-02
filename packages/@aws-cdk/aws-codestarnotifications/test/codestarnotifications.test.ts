import '@aws-cdk/assert-internal/jest';
import {} from '../lib';
import * as cdk from '@aws-cdk/core';
import * as notifications from '../lib';
import {
  FakeCodeCommitSource,
  FakeCodeBuildSource,
  FakeCodePipelineSource,
  FakeCodeDeploySource,
  FakeSnsTopicTarget,
  FakeSlackTarget,
} from './helpers';

describe('NotificationRule', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('created new notification rule', () => {
    const codeBuildSource = new FakeCodeBuildSource();
    const snsTopicTarget = new FakeSnsTopicTarget();
    const slackTarget = new FakeSlackTarget();

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
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
    const codeBuildSource = new FakeCodeBuildSource();
    const snsTopicTarget = new FakeSnsTopicTarget();

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
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

  test('should throw error if source events are invalid with CodeCommit RepositoryEvent', () => {
    const codeCommitSource = new FakeCodeCommitSource();
    const snsTopicTarget = new FakeSnsTopicTarget();

    expect(() => new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
      ],
      source: codeCommitSource,
      targets: [
        snsTopicTarget,
      ],
    })).toThrow(
      /codebuild-project-build-state-succeeded event id is not valid in CodeCommit/,
    );
  });

  test('should throw error if source events are invalid with CodeBuild ProjectEvent', () => {
    const codeBuildSource = new FakeCodeBuildSource();
    const snsTopicTarget = new FakeSnsTopicTarget();

    expect(() => new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
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
    const codepiPelineSource = new FakeCodePipelineSource();
    const snsTopicTarget = new FakeSnsTopicTarget();

    expect(() => new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.ApplicationEvent.DEPLOYMENT_SUCCEEDED,
      ],
      source: codepiPelineSource,
      targets: [
        snsTopicTarget,
      ],
    })).toThrow(
      /codedeploy-application-deployment-succeeded event id is not valid in CodePipeline/,
    );
  });

  test('should throw error if source events are invalid with CodeDeploy ProjectEvent', () => {
    const codeDeploySource = new FakeCodeDeploySource();
    const snsTopicTarget = new FakeSnsTopicTarget();

    expect(() => new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.PipelineEvent.PIPELINE_EXECUTION_SUCCEEDED,
      ],
      source: codeDeploySource,
      targets: [
        snsTopicTarget,
      ],
    })).toThrow(
      /codepipeline-pipeline-pipeline-execution-succeeded event id is not valid in CodeDeploy/,
    );
  });

  test('should throws error if source events are not provided', () => {
    const codeBuildSource = new FakeCodeBuildSource();
    const snsTopicTarget = new FakeSnsTopicTarget();

    expect(() => new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [],
      source: codeBuildSource,
      targets: [
        snsTopicTarget,
      ],
    })).toThrowError('"events" property must set at least 1 event');
  });

  test('from notification rule ARN', () => {
    const imported = notifications.NotificationRule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
    expect(imported.notificationRuleArn).toEqual('arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
  });
});