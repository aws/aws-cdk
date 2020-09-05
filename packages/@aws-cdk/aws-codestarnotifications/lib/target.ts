import * as chatbot from '@aws-cdk/aws-chatbot';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { INotificationRule } from './notification-rule';

/**
 * The target type of the notification rule.
 */
export enum TargetType {

  /**
   * Amazon SNS topics are specified as SNS.
   */
  SNS = 'SNS',

  /**
   * AWS Chatbot clients are specified as AWSChatbotSlack.
   */
  AWS_CHATBOT_SLACK = 'AWSChatbotSlack',
}

/**
 * Information about the SNS topics or AWS Chatbot clients associated with a notification rule.
 */
export interface NotificationTargetConfig {

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
 */
export interface INotificationTarget {

  /**
   * Binds target to notification rule
   * @param _notificationRule The notification rule
   */
  bind(_notificationRule: INotificationRule): NotificationTargetConfig;
}

/**
 * A Slack notification target
 */
export class SlackNotificationTarget implements INotificationTarget {

  /**
   * @param slackChannel The Slack channel configuration
   */
  constructor(readonly slackChannel: chatbot.ISlackChannelConfiguration) {}

  public bind(
    _notificationRule: INotificationRule,
  ): NotificationTargetConfig {
    return {
      targetType: TargetType.AWS_CHATBOT_SLACK,
      targetAddress: this.slackChannel.slackChannelConfigurationArn,
    };
  }
}

/**
 * A SNS topic notification target
 */
export class SnsTopicNotificationTarget implements INotificationTarget {

  /**
   * @param topic The SNS topic
   */
  constructor(readonly topic: sns.ITopic) {}

  public bind(
    _notificationRule: INotificationRule,
  ): NotificationTargetConfig {
    this.topic.grantPublish(new iam.ServicePrincipal('codestar-notifications.amazonaws.com'));

    return {
      targetType: TargetType.SNS,
      targetAddress: this.topic.topicArn,
    };
  }
}