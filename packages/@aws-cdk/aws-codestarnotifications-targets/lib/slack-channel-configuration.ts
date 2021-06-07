import * as chatbot from '@aws-cdk/aws-chatbot';
import * as notifications from '@aws-cdk/aws-codestarnotifications';

/**
 * A Slack notification target
 */
export class SlackChannelConfiguration implements notifications.IRuleTarget {

  /**
   * @param slackChannel The Slack channel configuration
   */
  constructor(readonly slackChannel: chatbot.ISlackChannelConfiguration) {}

  public bind(_rule: notifications.IRule): notifications.RuleTargetConfig {
    return {
      targetType: notifications.TargetType.AWS_CHATBOT_SLACK,
      targetAddress: this.slackChannel.slackChannelConfigurationArn,
    };
  }
}