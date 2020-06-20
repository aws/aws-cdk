import * as iam from '@aws-cdk/aws-iam';
import { IConstruct } from '@aws-cdk/core';
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
   * @param rule The EventBridge Rule that would trigger this target.
   * @param id The id of the target that will be attached to the rule.
   */
  bind(rule: IRule, id?: string): RuleTargetConfig;
}

/**
 * Properties for an event rule target
 */
export interface RuleTargetConfig {
  /**
   * A unique, user-defined identifier for the target. Acceptable values
   * include alphanumeric characters, periods (.), hyphens (-), and
   * underscores (_).
   *
   * @deprecated prefer auto-generated id by specifying an empty string
   */
  readonly id: string;

  /**
   * The Amazon Resource Name (ARN) of the target.
   */
  readonly arn: string;

  /**
   * Role to use to invoke this event target
   */
  readonly role?: iam.IRole;

  /**
   * Parameters used when the rule invokes Amazon AWS Batch Job/Queue
   * @default no parameters set
   */
  readonly batchParameters?: CfnRule.BatchParametersProperty;

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
   * Parameters used when the FIFO sqs queue is used an event target by the
   * rule.
   */
  readonly sqsParameters?: CfnRule.SqsParametersProperty;

  /**
   * What input to send to the event target
   *
   * @default the entire event
   */
  readonly input?: RuleTargetInput;

  /**
   * The resource that is backing this target.
   * This is the resource that will actually have some action performed on it when used as a target
   * (for example, start a build for a CodeBuild project).
   * We need it to determine whether the rule belongs to a different account than the target -
   * if so, we generate a more complex setup,
   * including an additional stack containing the EventBusPolicy.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-cross-account-event-delivery.html
   * @default the target is not backed by any resource
   */
  readonly targetResource?: IConstruct;
}
