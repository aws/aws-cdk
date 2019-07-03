import iam = require('@aws-cdk/aws-iam');
import { CfnRule } from './events.generated';
import { RuleTargetInput } from './input';
import { IRule } from './rule-ref';

/**
 * An abstract target for EventRules.
 */
export interface IRuleTarget {
  /**
   * Returns the rule target specification.
   * NOTE: Do not use the various `inputXxx` options. They can be set in a call to `addTarget`.
   *
   * @param rule The CloudWatch Event Rule that would trigger this target.
   * @param id The id of the target that wil be attached to the rule.
   */
  bind(rule: IRule, id: string): RuleTargetConfig;
}

/**
 * Properties for an event rule target
 */
export interface RuleTargetConfig {
  /**
   * The Amazon Resource Name (ARN) of the target.
   */
  readonly arn: string;

  /**
   * Role to use to invoke this event target
   */
  readonly role?: iam.IRole;

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
  readonly input?: RuleTargetInput;
}
