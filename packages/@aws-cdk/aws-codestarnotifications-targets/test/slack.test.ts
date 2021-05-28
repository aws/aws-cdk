import * as chatbot from '@aws-cdk/aws-chatbot';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as cdk from '@aws-cdk/core';
import * as targets from '../lib';
import { FakeCodeBuild } from './helpers';
import '@aws-cdk/assert/jest';

describe('SlackNotificationTarget', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('notification target to slack', () => {
    const dummySource = new FakeCodeBuild();

    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackChannelConfigurationName: 'MySlackChannel',
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
    });

    new notifications.Rule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PROJECT_BUILD_STATE_FAILED,
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
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      Targets: [
        {
          TargetAddress: {
            Ref: 'MySlackChannelA8E0B56C',
          },
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });
});