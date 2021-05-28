import { IRule } from './rule';

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
 * Information about the SNS topics or AWS Chatbot client associated with a notification target.
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
 */
export interface IRuleTarget {

  /**
   * Binds target to notification rule
   * @param _notificationRule The notification rule
   */
  bind(_notificationRule: IRule): TargetConfig;
}