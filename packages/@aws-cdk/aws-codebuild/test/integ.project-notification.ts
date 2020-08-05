import * as chatbot from '@aws-cdk/aws-chatbot';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as cdk from '@aws-cdk/core';
import * as codebuild from '../lib';

class ProjectWithNotificationInteg extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

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

    codebuildProject.addNotification({
      notificationRuleName: 'MyCodebuildProjectNotification',
      status: notifications.Status.ENABLED,
      detailType: notifications.DetailType.FULL,
      events: [
        notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
        notifications.ProjectEvent.BUILD_STATE_FAILED,
        notifications.ProjectEvent.BUILD_STATE_IN_PROGRESS,
      ],
      targets: [
        new notifications.SlackNotificationTarget(slackChannel),
      ],
    });
  }
}

const app = new cdk.App();

new ProjectWithNotificationInteg(app, 'ProjectWithNotificationInteg');

app.synth();