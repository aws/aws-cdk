import * as chatbot from '@aws-cdk/aws-chatbot';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as targets from '../lib';
import '@aws-cdk/assert/jest';

describe('NotificationRule', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('No tests are specified for this package', () => {
    expect(true).toBe(true);
  });

  test('codebuild send notification to slack', () => {
    const dummySource = new CodebuildDummySource();
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
        new targets.SlackNotificationTarget(slackChannel),
      ],
      source: dummySource,
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
    const dummySource = new CodebuildDummySource();
    const topic = new sns.Topic(stack, 'MyTopic', {});

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
        notifications.ProjectEvent.BUILD_STATE_FAILED,
      ],
      targets: [
        new targets.SnsTopicNotificationTarget(topic),
      ],
      source: dummySource,
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
    const dummySource = new CodebuildDummySource();
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
      source: dummySource,
    });

    notifier.addTarget(new targets.SnsTopicNotificationTarget(target1));
    notifier.addTarget(new targets.SnsTopicNotificationTarget(target2));
    notifier.addTarget(new targets.SlackNotificationTarget(target3));

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

class CodebuildDummySource implements notifications.INotificationSource {
  bind() {
    return {
      arn: 'arn:aws:codebuild:::project/MyCodebuildProject',
    };
  }
}