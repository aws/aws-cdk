import { IRule } from './rule';

/**
 * Information about the SNS topic or AWS Chatbot client associated with a notification target.
 */
export interface RuleTargetConfig {

  /**
   * The target type. Can be an Amazon SNS topic or AWS Chatbot client.
   */
  readonly targetType: string;

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
  bind(_rule: IRule): RuleTargetConfig;
}