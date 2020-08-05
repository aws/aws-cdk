import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as chatbot from '@aws-cdk/aws-chatbot';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as notifications from '../lib';

export = {
  'codestar notification tests': {
    'codebuild send notification to slack'(test: Test) {
      const stack = new cdk.Stack();
      const project = new codebuild.Project(stack, 'MyCodebuild', {
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            build: {
              commands: ['echo "Nothing to do!"'],
            },
          },
        }),
      });
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
        resource: project.projectArn,
      });

      expect(stack).to(haveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
        DetailType: 'FULL',
        EventTypeIds: [
          'codebuild-project-build-state-succeeded',
          'codebuild-project-build-state-failed',
        ],
        Name: 'MyNotificationRule',
        Resource: {
          'Fn::GetAtt': [
            'MyCodebuild72A60299',
            'Arn',
          ],
        },
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
      const project = new codebuild.Project(stack, 'MyCodebuild', {
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            build: {
              commands: ['echo "Nothing to do!"'],
            },
          },
        }),
      });
      const topic = new sns.Topic(stack, 'MyTopic', {});

      new notifications.NotificationRule(stack, 'MyNotificationRule', {
        notificationRuleName: 'MyNotificationRule',
        events: [
          notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
          notifications.ProjectEvent.BUILD_STATE_FAILED,
        ],
        targets: [
          new notifications.SNSTopicNotificationTarget(topic),
        ],
        resource: project.projectArn,
      });

      expect(stack).to(haveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
        DetailType: 'FULL',
        EventTypeIds: [
          'codebuild-project-build-state-succeeded',
          'codebuild-project-build-state-failed',
        ],
        Name: 'MyNotificationRule',
        Resource: {
          'Fn::GetAtt': [
            'MyCodebuild72A60299',
            'Arn',
          ],
        },
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
      const project = new codebuild.Project(stack, 'MyCodebuild', {
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            build: {
              commands: ['echo "Nothing to do!"'],
            },
          },
        }),
      });
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
        resource: project.projectArn,
      });

      notifier.addTarget(new notifications.SNSTopicNotificationTarget(target1));
      notifier.addTarget(new notifications.SNSTopicNotificationTarget(target2));
      notifier.addTarget(new notifications.SlackNotificationTarget(target3));

      expect(stack).to(haveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
        DetailType: 'FULL',
        EventTypeIds: [
          'codebuild-project-build-state-succeeded',
          'codebuild-project-build-state-failed',
        ],
        Name: 'MyNotificationRule',
        Resource: {
          'Fn::GetAtt': [
            'MyCodebuild72A60299',
            'Arn',
          ],
        },
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