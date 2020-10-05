import * as chatbot from '@aws-cdk/aws-chatbot';
import * as notifications from '@aws-cdk/aws-codestarnotifications';

/**
 * A Slack notification target
 */
export class SlackNotificationTarget implements notifications.INotificationTarget {

  /**
   * @param slackChannel The Slack channel configuration
   */
  constructor(readonly slackChannel: chatbot.ISlackChannelConfiguration) {}

  public bind(
    _notificationRule: notifications.INotificationRule,
  ): notifications.NotificationTargetConfig {
    return {
      targetType: notifications.TargetType.AWS_CHATBOT_SLACK,
      targetAddress: this.slackChannel.slackChannelConfigurationArn,
    };
  }
}