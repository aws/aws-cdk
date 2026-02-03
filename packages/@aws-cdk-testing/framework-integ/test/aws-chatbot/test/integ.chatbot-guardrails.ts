import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as chatbot from 'aws-cdk-lib/aws-chatbot';

class ChatbotGuardrailsInteg extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const guardrailPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchReadOnlyAccess');

    new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
      slackChannelConfigurationName: 'test-channel',
      slackWorkspaceId: 'T49239U4W', // modify to your slack workspace id
      slackChannelId: 'C0187JABUE9', // modify to your slack channel id
      guardrailPolicies: [guardrailPolicy],
    });
  }
}

const app = new cdk.App();

new ChatbotGuardrailsInteg(app, 'ChatbotGuardrailsInteg');

app.synth();
