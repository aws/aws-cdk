import '@aws-cdk/assert/jest';
import * as chatbot from '@aws-cdk/aws-chatbot';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as notifications from '../lib';

describe('NotificationRule', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('No tests are specified for this package', () => {
    expect(true).toBe(true);
  });

  test('codebuild send notification to slack', () => {
    const codebuildProjectArn = 'arn:aws:codebuild:::project/MyCodebuildProject';
    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackChannelConfigurationName: 'MySlackChannel',
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
    });

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
        notifications.ProjectEvent.BUILD_STATE_FAILED,
      ],
      targets: [
        new notifications.SlackNotificationTarget(slackChannel),
      ],
      resource: codebuildProjectArn,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
      ],
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild:::project/MyCodebuildProject',
      Targets: [
        {
          TargetAddress: {
            Ref: 'MySlackChannelA8E0B56C',
          },
          TargetType: 'AWSChatbotSlack',
        },
      ],
      Status: 'ENABLED',
    });
  });

  test('codebuild send notification to sns', () => {
    const codebuildProjectArn = 'arn:aws:codebuild:::project/MyCodebuildProject';
    const topic = new sns.Topic(stack, 'MyTopic', {});

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
        notifications.ProjectEvent.BUILD_STATE_FAILED,
      ],
      targets: [
        new notifications.SnsTopicNotificationTarget(topic),
      ],
      resource: codebuildProjectArn,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
      ],
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild:::project/MyCodebuildProject',
      Targets: [
        {
          TargetAddress: {
            Ref: 'MyTopic86869434',
          },
          TargetType: 'SNS',
        },
      ],
      Status: 'ENABLED',
    });
  });

  test('notification added targets', () => {
    const codebuildProjectArn = 'arn:aws:codebuild:::project/MyCodebuildProject';
    const target1 = new sns.Topic(stack, 'MyTopic1', {});
    const target2 = new sns.Topic(stack, 'MyTopic2', {});
    const target3 = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackChannelConfigurationName: 'MySlackChannel',
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
    });

    const notifier = new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
        notifications.ProjectEvent.BUILD_STATE_FAILED,
      ],
      targets: [],
      resource: codebuildProjectArn,
    });

    notifier.addTarget(new notifications.SnsTopicNotificationTarget(target1));
    notifier.addTarget(new notifications.SnsTopicNotificationTarget(target2));
    notifier.addTarget(new notifications.SlackNotificationTarget(target3));

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
      ],
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild:::project/MyCodebuildProject',
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
      Status: 'ENABLED',
    });
  });

  test('from notification rule ARN', () => {
    const imported = notifications.NotificationRule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications:::notificationrule/abcdef123456');

    expect(imported.notificationRuleArn).toEqual('arn:aws:codestar-notifications:::notificationrule/abcdef123456');
  });
});


