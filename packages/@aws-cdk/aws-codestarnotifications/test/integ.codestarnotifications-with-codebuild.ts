import * as chatbot from '@aws-cdk/aws-chatbot';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { NotificationRule, SlackNotificationTarget, SNSTopicNotificationTarget, Status, DetailType, ProjectEvent } from '../lib';

class CodestarnotificationsWithCodebuildInteg extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const codebuildProject = new codebuild.Project(this, 'MyCodebuild', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: ['echo "Nothing to do!"'],
          },
        },
      }),
    });

    const slackChannel = new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
      slackChannelConfigurationName: 'test-slack-with-codebuild',
      slackWorkspaceId: 'T49239U4W',
      slackChannelId: 'C0187JABUE9',
    });

    const topic1 = new sns.Topic(this, 'MyTopic1', {});
    const topic2 = new sns.Topic(this, 'MyTopic2', {});

    const notificationRule = new NotificationRule(this, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      status: Status.ENABLED,
      detailType: DetailType.FULL,
      events: [
        ProjectEvent.BUILD_STATE_SUCCEEDED,
        ProjectEvent.BUILD_STATE_FAILED,
        ProjectEvent.BUILD_PHASE_SUCCESS,
        ProjectEvent.BUILD_PHASE_FAILRE,
        ProjectEvent.BUILD_STATE_IN_PROGRESS,
        ProjectEvent.BUILD_STATE_STOPPED,
      ],
      targets: [
        new SlackNotificationTarget(slackChannel),
        new SNSTopicNotificationTarget(topic1),
      ],
      resource: codebuildProject.projectArn,
    });

    notificationRule.addTarget(new SNSTopicNotificationTarget(topic2));
  }
}

const app = new cdk.App();

new CodestarnotificationsWithCodebuildInteg(app, 'CodestarnotificationsWithCodebuildInteg');

app.synth();