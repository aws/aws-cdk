import * as cdk from '@aws-cdk/core';
import * as chatbot from '../lib';

describe('import slack channel configuration tests', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('should throw if ARN invalid', () => {
    expect(() => chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/my-slack')).toThrow(
      /The ARN of a Slack integration must be in the form: arn:aws:chatbot:accountId:chat-configuration\/slack-channel\/slackChannelName/,
    );
  });

  test('from slack channel configuration ARN', () => {
    const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');

    expect(imported.slackChannelConfigurationName).toEqual('my-slack');
    expect(imported.slackChannelConfigurationArn).toEqual('arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');
  });
});