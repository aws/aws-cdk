import * as cdk from '@aws-cdk/core';
import * as chatbot from '../lib';

let stack: cdk.Stack;

beforeEach(() => {
  stack = new cdk.Stack();
});

test('from slack channel configuration ARN', () => {
  const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');

  expect(imported.configurationName).toEqual('my-slack');
  expect(imported.slackChannelConfigurationArn).toEqual('arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');
});