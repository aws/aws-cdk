import { CfnRule } from './events.generated';
import { EventTargetInput } from './input';
import { IEventRule } from './rule-ref';

/**
 * An abstract target for EventRules.
 */
export interface IEventRuleTarget {
  /**
   * Returns the rule target specification.
   * NOTE: Do not use the various `inputXxx` options. They can be set in a call to `addTarget`.
   *
   * @param rule The CloudWatch Event Rule that would trigger this target.
   */
  bind(rule: IEventRule): EventRuleTargetProperties;
}

/**
 * Properties for an event rule target
 */
export interface EventRuleTargetProperties {
  /**
   * A unique, user-defined identifier for the target. Acceptable values
   * include alphanumeric characters, periods (.), hyphens (-), and
   * underscores (_).
   */
  readonly id: string;

  /**
   * The Amazon Resource Name (ARN) of the target.
   */
  readonly arn: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management
   * (IAM) role to use for this target when the rule is triggered. If one rule
   * triggers multiple targets, you can use a different IAM role for each
   * target.
   */
  readonly roleArn?: string;

  /**
   * The Amazon ECS task definition and task count to use, if the event target
   * is an Amazon ECS task.
   */
  readonly ecsParameters?: CfnRule.EcsParametersProperty;

  /**
   * Settings that control shard assignment, when the target is a Kinesis
   * stream. If you don't include this parameter, eventId is used as the
   * partition key.
   */
  readonly kinesisParameters?: CfnRule.KinesisParametersProperty;

  /**
   * Parameters used when the rule invokes Amazon EC2 Systems Manager Run
   * Command.
   */
  readonly runCommandParameters?: CfnRule.RunCommandParametersProperty;

  /**
   * What input to send to the event target
   *
   * @default the entire event
   */
  readonly input?: EventTargetInput;
}