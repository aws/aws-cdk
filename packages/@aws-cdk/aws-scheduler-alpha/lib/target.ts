import { Annotations, Duration, Names, PhysicalName, Token, TokenComparison, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { CfnSchedule } from 'aws-cdk-lib/aws-scheduler';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';
import { ScheduleTargetInput } from './input';
import { ISchedule } from './schedule';

export interface IScheduleTarget {
  bind(_schedule: ISchedule): ScheduleTargetConfig;
}

/**
 * Base properties for a Schedule Target
 */
export interface ScheduleTargetBaseProps {
  /**
   * An execution role is an IAM role that EventBridge Scheduler assumes in order to interact with other AWS services on your behalf.
   *
   * If none provided templates target will automatically create an IAM role with all the minimum necessary
   * permissions to interact with the templated target. If you wish you may specify your own IAM role, then the templated targets
   * will grant minimal required permissions.
   *
   * Universal target automatically create an IAM role if you do not specify your own IAM role.
   * However, in comparison with templated targets, for universal targets you must grant the required
   * IAM permissions yourself.
   *
   * @default - created by target
   */
  readonly role?: iam.IRole;
  /**
   * The SQS queue to be used as deadLetterQueue.
   *
   * The events not successfully delivered are automatically retried for a specified period of time,
   * depending on the retry policy of the target.
   * If an event is not delivered before all retry attempts are exhausted, it will be sent to the dead letter queue.
   *
   * @default - no dead-letter queue
   */
  readonly deadLetterQueue?: sqs.IQueue;

  /**
   * Input passed to the target.
   *
   * @default - no input.
   */
  readonly input?: ScheduleTargetInput;

  /**
   * The maximum age of a request that Scheduler sends to a target for processing.
   *
   * Minimum value of 60.
   * Maximum value of 86400.
   *
   * @default Duration.hours(24)
   */
  readonly maxEventAge?: Duration;
  /**
   * The maximum number of times to retry when the target returns an error.
   *
   * Minimum value of 0.
   * Maximum value of 185.
   *
   * @default 185
   */
  readonly retryAttempts?: number;
}

/**
 * Config of a Schedule Target used during initalization of Schedule
 */
export interface ScheduleTargetConfig {
  /**
   * The Amazon Resource Name (ARN) of the target.
   */
  readonly arn: string;

  /**
   * Role to use to invoke this event target
   */
  readonly role: iam.IRole;

  /**
   *  What input to pass to the tatget
   */
  readonly input?: ScheduleTargetInput;

  /**
   * A `RetryPolicy` object that includes information about the retry policy settings, including the maximum age of an event, and the maximum number of times EventBridge Scheduler will try to deliver the event to a target.
   */
  readonly retryPolicy?: CfnSchedule.RetryPolicyProperty;

  /**
   * An object that contains information about an Amazon SQS queue that EventBridge Scheduler uses as a dead-letter queue for your schedule. If specified, EventBridge Scheduler delivers failed events that could not be successfully delivered to a target to the queue.\
   */
  readonly deadLetterConfig?: CfnSchedule.DeadLetterConfigProperty

  /**
   *  The templated target type for the Amazon ECS RunTask API Operation.
   */
  readonly ecsParameters?: CfnSchedule.EcsParametersProperty;
  /**
   * The templated target type for the EventBridge PutEvents API operation.
   */
  readonly eventBridgeParameters?: CfnSchedule.EventBridgeParametersProperty;

  /**
   * The templated target type for the Amazon Kinesis PutRecord API operation.
   */
  readonly kinesisParameters?: CfnSchedule.KinesisParametersProperty;

  /**
   * The templated target type for the Amazon SageMaker StartPipelineExecution API operation.
   */
  readonly sageMakerPipelineParameters?: CfnSchedule.SageMakerPipelineParametersProperty;
  /**
   * The templated target type for the Amazon SQS SendMessage API Operation
   */
  readonly sqsParameters?: CfnSchedule.SqsParametersProperty;
}

/**
 * Bind props to base schedule target config.
 * @internal
 */
export function bindBaseTargetConfig(props: ScheduleTargetBaseProps) {
  let { deadLetterQueue } = props;

  return {
    deadLetterConfig: deadLetterQueue ? { arn: deadLetterQueue?.queueArn } : undefined,
    retryPolicy: renderRetryPolicy(props.maxEventAge, props.retryAttempts),
  };
}

const roleCache: {[key: string]: iam.Role} = {};

/**
 * Obtain the Role for the EventBridge Scheduler event
 *
 * If a role already exists, it will be returned. This ensures that if multiple
 * events have the same target, they will share a role.
 * @internal
 */
function singletonScheduleRole(schedule: ISchedule, targetArn: string): iam.IRole {
  const stack = Stack.of(schedule);
  const arn = Token.isUnresolved(targetArn) ? stack.resolve(targetArn).toString() : targetArn;
  const hash = md5hash(arn).slice(0, 6);
  const id = 'SchedulerRoleForTarget-' + hash;
  const existing = stack.node.tryFindChild(id) as iam.IRole;

  const principal = new iam.PrincipalWithConditions(new iam.ServicePrincipal('scheduler.amazonaws.com'), {
    StringEquals: {
      'aws:SourceAccount': schedule.env.account,
    },
  });
  if (existing) {
    roleCache[targetArn].assumeRolePolicy?.addStatements(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal('scheduler.amazonaws.com')],
      actions: ['sts:AssumeRole'],
    }));
    return existing;
  }
  const role = new iam.Role(stack, id, {
    roleName: PhysicalName.GENERATE_IF_NEEDED,
    assumedBy: principal,
  });
  roleCache[targetArn] = role;
  return role;
}

/**
 * Allow a schedule to send events with failed invocation to an Amazon SQS queue.
 * @internal
 */
export function addToDeadLetterQueueResourcePolicy(schedule: ISchedule, queue: sqs.IQueue) {
  if (!sameEnvDimension(schedule.env.region, queue.env.region)) {
    throw new Error(`Cannot assign Dead Letter Queue in region ${queue.env.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the queue and the schedule must be in the same region.`);
  }

  // Skip Resource Policy creation if the Queue is not in the same account.
  // There is no way to add a target onto an imported schedule, so we can assume we will run the following code only
  // in the account where the schedule is created.
  if (sameEnvDimension(schedule.env.account, queue.env.account)) {
    const policyStatementId = `AllowSchedule${Names.nodeUniqueId(schedule.node)}`;

    queue.addToResourcePolicy(new iam.PolicyStatement({
      sid: policyStatementId,
      principals: [new iam.ServicePrincipal('events.amazonaws.com')],
      effect: iam.Effect.ALLOW,
      actions: ['sqs:SendMessage'],
      resources: [queue.queueArn],
    }));
  } else {
    Annotations.of(schedule).addWarning(`Cannot add a resource policy to your dead letter queue associated with schedule ${schedule.scheduleName} because the queue is in a different account. You must add the resource policy manually to the dead letter queue in account ${queue.env.account}.`);
  }
}

/**
 * Whether two string probably contain the same environment dimension (region or account)
 *
 * Used to compare either accounts or regions, and also returns true if both
 * are unresolved (in which case both are expted to be "current region" or "current account").
 * @internal
 */
function sameEnvDimension(dim1: string, dim2: string) {
  return [TokenComparison.SAME, TokenComparison.BOTH_UNRESOLVED].includes(Token.compareStrings(dim1, dim2));
}

export function renderRetryPolicy(maximumEventAge: Duration | undefined, maximumRetryAttempts: number | undefined): CfnSchedule.RetryPolicyProperty {
  const maxMaxAge = Duration.days(1).toSeconds();
  const minMaxAge = Duration.minutes(15).toSeconds();
  let maxAge: number = maxMaxAge;
  if (maximumEventAge) {
    maxAge = maximumEventAge.toSeconds({ integral: true });
    if (maxAge > maxMaxAge) {
      throw new Error('Maximum event age is 1 day');
    }
    if (maxAge < minMaxAge) {
      throw new Error('Minimum event age is 15 minutes');
    }
  };
  let maxAttempts = 185;
  if (typeof maximumRetryAttempts != 'undefined') {
    if (maximumRetryAttempts < 0) {
      throw Error('Number of retry attempts should be greater or equal than 0');
    }
    if (maximumRetryAttempts > 185) {
      throw Error('Number of retry attempts should be less or equal than 185');
    }
    maxAttempts = maximumRetryAttempts;
  }
  return {
    maximumEventAgeInSeconds: maxAge,
    maximumRetryAttempts: maxAttempts,
  };
}

export namespace targets {
  export class LambdaInvoke implements IScheduleTarget {
    constructor(
      private readonly func: lambda.IFunction,
      private readonly props: ScheduleTargetBaseProps,
    ) {
    }

    bind(_schedule: ISchedule): ScheduleTargetConfig {
      if (!sameEnvDimension(this.func.env.region, _schedule.env.region)) {
        throw new Error(`Cannot assign function in region ${this.func.env.region} to the schedule ${Names.nodeUniqueId(_schedule.node)} in region ${_schedule.env.region}. Both the schedule and the function must be in the same region.`);
      }

      if (!sameEnvDimension(this.func.env.account, _schedule.env.account)) {
        throw new Error(`Cannot assign function in account ${this.func.env.account} to the schedule ${Names.nodeUniqueId(_schedule.node)} in account ${_schedule.env.region}. Both the schedule and the function must be in the same account.`);
      }

      if (this.props.deadLetterQueue) {
        addToDeadLetterQueueResourcePolicy(_schedule, this.props.deadLetterQueue);
      }

      if (this.props.role && !sameEnvDimension(this.props.role.env.account, this.func.env.account)) {
        throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(this.func.node)} in account ${this.func.env.account}. Both the target and the execution role must be in the same account.`);
      }

      const role = this.props.role ?? singletonScheduleRole(_schedule, this.func.functionArn);
      this.func.grantInvoke(role);

      return {
        ...bindBaseTargetConfig(this.props),
        role: role,
        arn: this.func.functionArn,
        input: this.props.input,
      };

    }
  }
}