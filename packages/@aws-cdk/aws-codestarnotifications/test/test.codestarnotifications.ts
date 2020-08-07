import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as chatbot from '@aws-cdk/aws-chatbot';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as notifications from '../lib';

export = {
  'codestar notification tests': {
    'codebuild send notification to slack'(test: Test) {
      const stack = new cdk.Stack();
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

      expect(stack).to(haveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
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
      }));

      test.done();
    },

    'codebuild send notification to sns'(test: Test) {
      const stack = new cdk.Stack();
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

      expect(stack).to(haveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
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
      }));

      test.done();
    },

    'notification added targets'(test: Test) {
      const stack = new cdk.Stack();
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

      expect(stack).to(haveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
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
      }));

      test.done();
    },
  },

  'from notification rule ARN'(test: Test) {
    const stack = new cdk.Stack();
    const imported = notifications.NotificationRule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications:::notificationrule/abcdef123456');

    test.deepEqual(imported.notificationRuleArn, 'arn:aws:codestar-notifications:::notificationrule/abcdef123456');
    test.done();
  },
};