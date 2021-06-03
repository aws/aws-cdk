import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as notifications from '../lib';
import {
  FakeCodeBuild,
  FakeCodePipeline,
  FakeIncorrectResource,
  FakeSlackTarget,
  FakeSnsTopicTarget,
} from './helpers';

describe('Rule', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('created new notification rule', () => {
    const project = new FakeCodeBuild();
    const topic = new FakeSnsTopicTarget();
    const slack = new FakeSlackTarget();

    new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
      detailType: notifications.DetailType.FULL,
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

  test('created new notification rule without name and will generate from the `id`', () => {
    const project = new FakeCodeBuild();
    const topic = new FakeSnsTopicTarget();
    const slack = new FakeSlackTarget();

    new notifications.Rule(stack, 'MyNotificationRuleGeneratedFromId', {
      detailType: notifications.DetailType.FULL,
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
      Name: 'MyNotificationRuleGeneratedFromId',
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

  test('generating name will cut if id length is over than 64 charts', () => {
    const project = new FakeCodeBuild();
    const topic = new FakeSnsTopicTarget();
    const slack = new FakeSlackTarget();

    new notifications.Rule(stack, 'MyNotificationRuleGeneratedFromIdIsToooooooooooooooooooooooooooooLong', {
      detailType: notifications.DetailType.FULL,
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
      Name: 'MyNotificationRuleGeneratedFromIdIsTooooooooooooooooooooooooooo',
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

  test('created new notification rule without detailType', () => {
    const project = new FakeCodeBuild();
    const topic = new FakeSnsTopicTarget();

    new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
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

  test('created new notification rule with status DISABLED', () => {
    const project = new FakeCodeBuild();
    const topic = new FakeSnsTopicTarget();

    new notifications.Rule(stack, 'MyNotificationRule', {
      detailType: notifications.DetailType.FULL,
      ruleName: 'MyNotificationRule',
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

  test('created new notification rule with projectArn inside object', () => {
    const topic = new FakeSnsTopicTarget();
    const slack = new FakeSlackTarget();

    new notifications.Rule(stack, 'MyNotificationRule', {
      detailType: notifications.DetailType.FULL,
      ruleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PROJECT_BUILD_STATE_FAILED,
      ],
      source: {
        projectArn: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      },
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

  test('created new notification rule with pipelineArn inside object', () => {
    const topic = new FakeSnsTopicTarget();
    const slack = new FakeSlackTarget();

    new notifications.Rule(stack, 'MyNotificationRule', {
      detailType: notifications.DetailType.FULL,
      ruleName: 'MyNotificationRule',
      events: [
        notifications.Event.PIPELINE_ACTION_EXECUTION_SUCCEEDED,
      ],
      source: {
        pipelineArn: 'arn:aws:codepipeline::1234567890:MyCodepipelineProject',
      },
      targets: [
        topic,
        slack,
      ],
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codepipeline-pipeline-action-execution-succeeded',
      ],
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codepipeline::1234567890:MyCodepipelineProject',
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

  test('notification added targets', () => {
    const project = new FakeCodeBuild();
    const topic1: notifications.IRuleTarget = {
      bind: () => ({
        targetType: notifications.TargetType.SNS,
        targetAddress: 'arn:aws:sns::1234567890:MyTopic1',
      }),
    };
    const topic2: notifications.IRuleTarget = {
      bind: () => ({
        targetType: notifications.TargetType.SNS,
        targetAddress: 'arn:aws:sns::1234567890:MyTopic2',
      }),
    };
    const slack = new FakeSlackTarget();

    const rule = new notifications.Rule(stack, 'MyNotificationRule', {
      detailType: notifications.DetailType.FULL,
      ruleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PROJECT_BUILD_STATE_FAILED,
      ],
      targets: [],
      source: project,
    });

    rule.addTarget(topic1);
    rule.addTarget(topic2);
    rule.addTarget(slack);

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
          TargetAddress: 'arn:aws:sns::1234567890:MyTopic1',
          TargetType: 'SNS',
        },
        {
          TargetAddress: 'arn:aws:sns::1234567890:MyTopic2',
          TargetType: 'SNS',
        },
        {
          TargetAddress: 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/MySlackChannel',
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });

  test('should throw error if specify multiple sources', () => {
    const project = new FakeCodeBuild();
    const pipeline = new FakeCodePipeline();
    const topic = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PIPELINE_PIPELINE_EXECUTION_SUCCEEDED,
      ],
      source: {
        projectArn: project.projectArn,
        pipelineArn: pipeline.pipelineArn,
      },
      targets: [
        topic,
      ],
    })).toThrow(
      /only one source can be specified/,
    );
  });

  test('should throw error if source events are invalid with CodeBuild ProjectEvent', () => {
    const project = new FakeCodeBuild();
    const topic = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
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
      ruleName: 'MyNotificationRule',
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
      ruleName: 'MyNotificationRule',
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
      ruleName: 'MyNotificationRule',
      events: [notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED],
      // @ts-ignore
      source: someResource,
      targets: [
        topic,
      ],
    })).toThrowError('"source" property must have "projectArn" or "pipelineArn"');
  });

  test('from notification rule ARN', () => {
    const imported = notifications.Rule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
    expect(imported.ruleArn).toEqual('arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
  });
});