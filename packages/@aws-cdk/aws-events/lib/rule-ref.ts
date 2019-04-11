import { IConstruct } from '@aws-cdk/cdk';

export interface EventRuleImportProps {
  /**
   * The value of the event rule Amazon Resource Name (ARN), such as
   * arn:aws:events:us-east-2:123456789012:rule/example.
   */
  readonly eventRuleArn: string;
}

export interface IEventRule extends IConstruct {
  /**
   * The value of the event rule Amazon Resource Name (ARN), such as
   * arn:aws:events:us-east-2:123456789012:rule/example.
   */
  readonly ruleArn: string;

  /**
   * Exports this rule resource from this stack and returns an import token.
   */
  export(): EventRuleImportProps;
}
