import * as chatbot from '@aws-cdk/aws-chatbot';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as cdk from '@aws-cdk/core';
import * as targets from '../lib';

class SlackInteg extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const slack = new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
      slackChannelConfigurationName: 'test-channel',
      slackWorkspaceId: 'T49239U4W', // modify to your slack workspace id
      slackChannelId: 'C0187JABUE9', // modify to your slack channel id
      loggingLevel: chatbot.LoggingLevel.NONE,
    });

    const project = new codebuild.Project(this, 'MyCodebuildProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'echo "Hello, CodeBuild!"',
            ],
          },
        },
      }),
    });

    const rule = new notifications.Rule(this, 'MyNotificationRule', {
      source: project,
    });

    rule.addEvents(['codebuild-project-build-state-succeeded']);

    rule.addTarget(new targets.SlackChannelConfiguration(slack));
  }
}

const app = new cdk.App();

new SlackInteg(app, 'SlackInteg');

app.synth();

