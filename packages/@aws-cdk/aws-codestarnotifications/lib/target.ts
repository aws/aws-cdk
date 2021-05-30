import * as chatbot from '@aws-cdk/aws-chatbot';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as notifications from './rule';


/**
 * The target type of the notification rule.
 */
export enum TargetType {

  /**
   * Amazon SNS topic are specified as SNS.
   */
  SNS = 'SNS',

  /**
   * AWS Chatbot clients are specified as AWSChatbotSlack.
   */
  AWS_CHATBOT_SLACK = 'AWSChatbotSlack',
}

/**
 * Information about the SNS topic or AWS Chatbot client associated with a notification target.
 */
export interface TargetConfig {

  /**
   * The target type. Can be an Amazon SNS topic or AWS Chatbot client.
   */
  readonly targetType: TargetType;

  /**
   * The Amazon Resource Name (ARN) of the Amazon SNS topic or AWS Chatbot client.
   */
  readonly targetAddress: string;
}

/**
 * Represents a notification target
 * That allows AWS Chatbot and SNS topic to associate with this rule target.
 */
export interface IRuleTarget {
  /**
   * Binds target to notification rule
   * @param _notificationRule The notification rule
   */
  bind(_notificationRule: notifications.IRule): TargetConfig;
}

/**
 * A Slack notification target
 */
export class SlackNotificationTarget implements IRuleTarget {
  /**
   * @param slackChannel The Slack channel configuration
   */
  constructor(readonly slackChannel: chatbot.ISlackChannelConfiguration) {}

  public bind(
    _notificationRule: notifications.IRule,
  ): TargetConfig {
    return {
      targetType: TargetType.AWS_CHATBOT_SLACK,
      targetAddress: this.slackChannel.slackChannelConfigurationArn,
    };
  }
}

/**
 * A SNS topic notification target
 */
export class SnsTopicNotificationTarget implements IRuleTarget {
  /**
   * @param topic The SNS topic
   */
  constructor(readonly topic: sns.ITopic) {}

  public bind(
    _notificationRule: notifications.IRule,
  ): TargetConfig {

    // SNS topic need to grant codestar-notifications service to publish
    // @see https://docs.aws.amazon.com/dtconsole/latest/userguide/set-up-sns.html
    this.topic.grantPublish(new iam.ServicePrincipal('codestar-notifications.amazonaws.com'));

    return {
      targetType: TargetType.SNS,
      targetAddress: this.topic.topicArn,
    };
  }
}