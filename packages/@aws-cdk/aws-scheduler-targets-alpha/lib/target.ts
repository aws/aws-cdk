import { ISchedule, ScheduleTargetConfig, ScheduleTargetInput } from '@aws-cdk/aws-scheduler-alpha';
import { Annotations, Duration, Names, PhysicalName, Token, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnSchedule } from 'aws-cdk-lib/aws-scheduler';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';
import { sameEnvDimension } from './util';

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
 * Base class for Schedule Targets
 */
export abstract class ScheduleTargetBase {

  constructor(
    protected readonly baseProps: ScheduleTargetBaseProps,
    protected readonly targetArn: string,
  ) {
  }

  protected abstract addTargetActionToRole(schedule: ISchedule, role: iam.IRole): void;

  protected bindBaseTargetConfig(_schedule: ISchedule): ScheduleTargetConfig {
    const role: iam.IRole = this.baseProps.role ?? this.singletonScheduleRole(_schedule, this.targetArn);
    this.addTargetActionToRole(_schedule, role);

    if (this.baseProps.deadLetterQueue) {
      this.addToDeadLetterQueueResourcePolicy(_schedule, this.baseProps.deadLetterQueue);
    }

    return {
      arn: this.targetArn,
      role: role,
      deadLetterConfig: this.baseProps.deadLetterQueue ? {
        arn: this.baseProps.deadLetterQueue.queueArn,
      } : undefined,
      retryPolicy: this.renderRetryPolicy(this.baseProps.maxEventAge, this.baseProps.retryAttempts),
      input: this.baseProps.input,
    };
  }

  /**
   * Create a return a Schedule Target Configuration for the given schedule
   * @param schedule
   * @returnn
   */
  bind(schedule: ISchedule): ScheduleTargetConfig {
    return this.bindBaseTargetConfig(schedule);
  }

  /**
   * Obtain the Role for the EventBridge Scheduler event
   *
   * If a role already exists, it will be returned. This ensures that if multiple
   * events have the same target, they will share a role.
   */
  protected singletonScheduleRole(schedule: ISchedule, targetArn: string): iam.IRole {
    const stack = Stack.of(schedule);
    const arn = Token.isUnresolved(targetArn) ? stack.resolve(targetArn).toString() : targetArn;
    const hash = md5hash(arn).slice(0, 6);
    const id = 'SchedulerRoleForTarget-' + hash;
    const existingRole = stack.node.tryFindChild(id) as iam.Role;

    const principal = new iam.PrincipalWithConditions(new iam.ServicePrincipal('scheduler.amazonaws.com'), {
      StringEquals: {
        'aws:SourceAccount': schedule.env.account,
      },
    });
    if (existingRole) {
      existingRole.assumeRolePolicy?.addStatements(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [principal],
        actions: ['sts:AssumeRole'],
      }));
      return existingRole;
    }
    const role = new iam.Role(stack, id, {
      roleName: PhysicalName.GENERATE_IF_NEEDED,
      assumedBy: principal,
    });
    return role;
  }

  /**
   * Allow a schedule to send events with failed invocation to an Amazon SQS queue.
   * @param schedule schedule to add DLQ to
   * @param queue the DLQ
   */
  protected addToDeadLetterQueueResourcePolicy(schedule: ISchedule, queue: sqs.IQueue) {
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
        principals: [new iam.ServicePrincipal('scheduler.amazonaws.com')],
        effect: iam.Effect.ALLOW,
        actions: ['sqs:SendMessage'],
        resources: [queue.queueArn],
      }));
    } else {
      Annotations.of(schedule).addWarning(`Cannot add a resource policy to your dead letter queue associated with schedule ${schedule.scheduleName} because the queue is in a different account. You must add the resource policy manually to the dead letter queue in account ${queue.env.account}.`);
    }
  }

  protected renderRetryPolicy(maximumEventAge: Duration | undefined, maximumRetryAttempts: number | undefined): CfnSchedule.RetryPolicyProperty {
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
}