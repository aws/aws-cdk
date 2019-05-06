import { IResource } from '@aws-cdk/cdk';

export interface EventRuleAttributes {
  /**
   * The value of the event rule Amazon Resource Name (ARN), such as
   * arn:aws:events:us-east-2:123456789012:rule/example.
   */
  readonly eventRuleArn: string;
}

export interface IEventRule extends IResource {
  /**
   * The value of the event rule Amazon Resource Name (ARN), such as
   * arn:aws:events:us-east-2:123456789012:rule/example.
   *
   * @attribute
   */
  readonly ruleArn: string;

  /**
   * Exports this rule resource from this stack and returns an import token.
   */
  export(): EventRuleAttributes;
}
