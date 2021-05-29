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
   * The ARN of the Slack channel configuration
   * It's own property of Slack channel configuration in AWS Chatbot, which means it should be type of slack channel configuration in AWS Chatbot if the target has `slackChannelConfigurationArn` property.
   * In the form of arn:aws:chatbot:{region}:{account}:chat-configuration/slack-channel/{slackChannelName}
   *
   * @default None
   */
  readonly slackChannelConfigurationArn?: string;

  /**
   * The ARN of the SNS topic
   * It's own property of SNS topic, which means it should be type of SNS topic if the target has `topicArn` property.
   * In the form of arn:aws:sns:{region}:{account}:{topicName}
   *
   * @default None
   */
  readonly topicArn?: string;
}