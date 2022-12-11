import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as chatbot from '../lib';

class ChatbotFromArnInteg extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const slackChannel = new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
      slackChannelConfigurationName: 'test-channel',
      slackWorkspaceId: 'T49239U4W', // modify to your slack workspace id
      slackChannelId: 'C0187JABUE9', // modify to your slack channel id
      loggingLevel: chatbot.LoggingLevel.NONE,
    });

    const slackChannelFromArn = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(this, 'RetrievedSlackChannel', slackChannel.slackChannelConfigurationArn);

    slackChannelFromArn.addNotificationTopic(new sns.Topic(this, 'MyFirstTopic'));
    slackChannelFromArn.addNotificationTopic(new sns.Topic(this, 'MySecondTopic'));
  }
}

const app = new cdk.App();

const stack = new ChatbotFromArnInteg(app, 'ChatbotFromArnInteg');
new IntegTest(app, 'ChatbotFromArn', {
  testCases: [stack],
});

app.synth();

