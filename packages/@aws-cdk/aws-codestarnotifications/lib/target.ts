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
export interface RuleTargetConfig {

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
   * @param _rule The notification rule
   */
  bind(_rule: notifications.IRule): RuleTargetConfig;
}