import * as cdk from 'aws-cdk-lib';
import * as chatbot from 'aws-cdk-lib/aws-chatbot';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const testStack = new cdk.Stack(app, 'ChatbotInteg');
new chatbot.SlackChannelConfiguration(testStack, 'MySlackChannel', {
  slackChannelConfigurationName: 'test-channel',
  slackWorkspaceId: 'T075XU2GKBP',
  slackChannelId: 'C07639U21PW',
  userRoleRequired: true,
});

new IntegTest(app, 'integ-chatbot-user-role-required', {
  testCases: [testStack],
});
