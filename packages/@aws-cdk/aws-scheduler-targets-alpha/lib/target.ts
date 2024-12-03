import { ISchedule, ScheduleTargetConfig, ScheduleTargetInput } from '@aws-cdk/aws-scheduler-alpha';
import { Duration, PhysicalName, Stack, Token } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnSchedule } from 'aws-cdk-lib/aws-scheduler';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';

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
    private readonly baseProps: ScheduleTargetBaseProps,
    protected readonly targetArn: string,
  ) {
  }

  protected abstract addTargetActionToRole(role: iam.IRole): void;

  protected bindBaseTargetConfig(_schedule: ISchedule): ScheduleTargetConfig {
    const role: iam.IRole = this.baseProps.role ?? this.createOrGetScheduleTargetRole(_schedule, this.targetArn);

    this.addTargetActionToRole(role);

    if (this.baseProps.deadLetterQueue) {
      this.addDeadLetterQueueActionToRole(role, this.baseProps.deadLetterQueue);
    }

    return {
      arn: this.targetArn,
      role,
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
   * @returns a Schedule Target Configuration
   */
  bind(schedule: ISchedule): ScheduleTargetConfig {
    return this.bindBaseTargetConfig(schedule);
  }

  /**
   * Get or create the Role for the EventBridge Scheduler event
   *
   * If a role already exists, it will be returned. This ensures that if multiple
   * schedules have the same target, they will share a role.
   */
  private createOrGetScheduleTargetRole(schedule: ISchedule, targetArn: string): iam.IRole {
    const stack = Stack.of(schedule);
    const arn = Token.isUnresolved(targetArn) ? JSON.stringify(stack.resolve(targetArn)) : targetArn;
    const hash = md5hash(arn).slice(0, 6);
    const id = 'SchedulerRoleForTarget-' + hash;
    const existingRole = stack.node.tryFindChild(id) as iam.Role;

    const principal = new iam.ServicePrincipal('scheduler.amazonaws.com', {
      conditions: {
        StringEquals: {
          'aws:SourceAccount': schedule.env.account,
          'aws:SourceArn': schedule.group?.groupArn ?? Stack.of(schedule).formatArn({
            service: 'scheduler',
            resource: 'schedule-group',
            region: schedule.env.region,
            account: schedule.env.account,
            resourceName: schedule.group?.groupName ?? 'default',
          }),
        },
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
   * Allow schedule to send events with failed invocation to an Amazon SQS queue.
   */
  private addDeadLetterQueueActionToRole(role: iam.IRole, queue: sqs.IQueue) {
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['sqs:SendMessage'],
      resources: [queue.queueArn],
    }));
  }

  private renderRetryPolicy(maximumEventAge: Duration | undefined, maximumRetryAttempts: number | undefined): CfnSchedule.RetryPolicyProperty {
    const maxMaxAge = Duration.days(1).toSeconds();
    const minMaxAge = Duration.minutes(1).toSeconds();
    let maxAge: number = maxMaxAge;
    if (maximumEventAge) {
      maxAge = maximumEventAge.toSeconds({ integral: true });
      if (maxAge > maxMaxAge) {
        throw new Error('Maximum event age is 1 day');
      }
      if (maxAge < minMaxAge) {
        throw new Error('Minimum event age is 1 minute');
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
