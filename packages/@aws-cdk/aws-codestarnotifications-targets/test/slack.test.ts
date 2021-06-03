import '@aws-cdk/assert-internal/jest';
import * as chatbot from '@aws-cdk/aws-chatbot';
// import * as codebuild from '@aws-cdk/aws-codebuild';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as cdk from '@aws-cdk/core';
import * as targets from '../lib';
import { FakeCodeBuild } from './helpers';

describe('SlackNotificationTarget', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('notification target to slack', () => {
    const project = new FakeCodeBuild();
    // const project = new codebuild.Project(stack, 'MyCodebuildProject', {
    //   buildSpec: codebuild.BuildSpec.fromObject({
    //     version: '0.2',
    //     phases: {
    //       build: {
    //         commands: [
    //           'echo "Hello, CodeBuild!"',
    //         ],
    //       },
    //     },
    //   }),
    // });

    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackChannelConfigurationName: 'MySlackChannel',
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
    });

    new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PROJECT_BUILD_STATE_FAILED,
      ],
      targets: [
        new targets.SlackChannelConfiguration(slackChannel),
      ],
      source: project,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
      ],
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild::123456789000:project/MyCodebuildProject',
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