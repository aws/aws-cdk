
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as chatbot from '../lib';

class ChatbotInteg extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const slackChannel = new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
      slackChannelConfigurationName: 'test-channel',
      slackWorkspaceId: 'T49239U4W', // modify to your slack workspace id
      slackChannelId: 'C50KJMXPG',   // modify to your slack channel id
    });

    slackChannel.addLambdaInvokeCommandPermissions();
    slackChannel.addNotificationPermissions();
    slackChannel.addSupportCommandPermissions();
    slackChannel.addReadOnlyCommandPermissions();

    slackChannel.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
      ],
      resources: ['arn:aws:s3:::abc/xyz/123.txt'],
    }));
  }
}

const app = new cdk.App();

new ChatbotInteg(app, 'ChatbotInteg');

app.synth();

