import { IResource } from '@aws-cdk/core';

/**
 * Represents an AWS IoT Rule
 */
export interface ITopicRule extends IResource {
  /**
   * The value of the topic rule Amazon Resource Name (ARN), such as
   * arn:aws:iot:us-east-2:123456789012:rule/rule_name
   *
   * @attribute
   */
  readonly topicRuleArn: string;

  /**
   * The name topic rule
   *
   * @attribute
   */
  readonly topicRuleName: string;
}
