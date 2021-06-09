import * as chatbot from '@aws-cdk/aws-chatbot';
import * as notifications from '@aws-cdk/aws-codestarnotifications';

/**
 * A Slack notification target
 */
export class SlackChannelConfiguration implements notifications.INotificationRuleTarget {
  /**
   * @param slackChannel The Slack channel configuration
   */
  constructor(readonly slackChannel: chatbot.ISlackChannelConfiguration) {}

  public bind(_rule: notifications.INotificationRule): notifications.NotificationRuleTargetConfig {
    return {
      targetType: 'AWSChatbotSlack',
      targetAddress: this.slackChannel.slackChannelConfigurationArn,
    };
  }
}