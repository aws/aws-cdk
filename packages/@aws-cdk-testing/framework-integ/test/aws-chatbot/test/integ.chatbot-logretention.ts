import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib';
import * as chatbot from 'aws-cdk-lib/aws-chatbot';

class ChatbotLogRetentionInteg extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const slackChannel = new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
      slackChannelConfigurationName: 'test-channel',
      slackWorkspaceId: 'T49239U4W', // modify to your slack workspace id
      slackChannelId: 'C0187JABUE9', // modify to your slack channel id
      loggingLevel: chatbot.LoggingLevel.NONE,
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    slackChannel.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
      ],
      resources: ['arn:aws:s3:::abc/xyz/123.txt'],
    }));
  }
}

const app = new cdk.App();

new ChatbotLogRetentionInteg(app, 'ChatbotLogRetentionInteg');

app.synth();
