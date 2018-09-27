import { cloudformation } from './events.generated';

export interface EventRuleTargetProps {
  /**
   * A unique, user-defined identifier for the target. Acceptable values
   * include alphanumeric characters, periods (.), hyphens (-), and
   * underscores (_).
   */
  id: string;

  /**
   * The Amazon Resource Name (ARN) of the target.
   */
  arn: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management
   * (IAM) role to use for this target when the rule is triggered. If one rule
   * triggers multiple targets, you can use a different IAM role for each
   * target.
   */
  roleArn?: string;

  /**
   * The Amazon ECS task definition and task count to use, if the event target
   * is an Amazon ECS task.
   */
  ecsParameters?: cloudformation.RuleResource.EcsParametersProperty;

  /**
   * Settings that control shard assignment, when the target is a Kinesis
   * stream. If you don't include this parameter, eventId is used as the
   * partition key.
   */
  kinesisParameters?: cloudformation.RuleResource.KinesisParametersProperty;

  /**
   * Parameters used when the rule invokes Amazon EC2 Systems Manager Run
   * Command.
   */
  runCommandParameters?: cloudformation.RuleResource.RunCommandParametersProperty;
}

/**
 * An abstract target for EventRules.
 */
export interface IEventRuleTarget {
  /**
   * Returns the rule target specification.
   * NOTE: Do not use the various `inputXxx` options. They can be set in a call to `addTarget`.
   *
   * @param ruleArn The ARN of the CloudWatch Event Rule that would trigger this target.
   * @param ruleUniqueId A unique ID for this rule. Can be used to implement idempotency.
   */
  asEventRuleTarget(ruleArn: string, ruleUniqueId: string): EventRuleTargetProps;
}
