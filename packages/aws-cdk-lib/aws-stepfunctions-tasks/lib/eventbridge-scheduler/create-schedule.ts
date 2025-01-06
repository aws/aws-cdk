import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as kms from '../../../aws-kms';
import * as sqs from '../../../aws-sqs';
import * as sfn from '../../../aws-stepfunctions';
import { Stack, Duration, Token } from '../../../core';
import { integrationResourceArn } from '../private/task-utils';
import { Schedule } from '../schedule';

/**
 * The action that EventBridge Scheduler applies to the schedule after the schedule completes invoking the target.
 */
export enum ActionAfterCompletion {
  /**
   * Takes no action
   */
  NONE = 'NONE',
  /**
   * Deletes the schedule
   */
  DELETE = 'DELETE',
}

/**
 * Properties for creating an AWS EventBridge Scheduler schedule
 */
export interface EventBridgeSchedulerCreateScheduleTaskProps extends sfn.TaskStateBaseProps {
  /**
   * Schedule name
   */
  readonly scheduleName: string;

  /**
   * Specifies the action that EventBridge Scheduler applies to the schedule after the schedule completes invoking the target.
   *
   * @default ActionAfterCompletion.NONE
   */
  readonly actionAfterCompletion?: ActionAfterCompletion;

  /**
   * Unique, case-sensitive identifier to ensure the idempotency of the request.
   *
   * @default - Automatically generated
   */
  readonly clientToken?: string;

  /**
   * The description for the schedule.
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * The date, in UTC, before which the schedule can invoke its target.
   * Depending on the schedule's recurrence expression, invocations might stop on, or before, the EndDate you specify.
   * EventBridge Scheduler ignores EndDate for one-time schedules.
   *
   * @default - No end date
   */
  readonly endDate?: Date;

  /**
   * The maximum time window during which a schedule can be invoked.
   *
   * Minimum value is 1 minute.
   * Maximum value is 1440 minutes (1 day).
   *
   * @default - Flexible time window is not enabled.
   */
  readonly flexibleTimeWindow?: Duration;

  /**
   * The name of the schedule group to associate with this schedule.
   *
   * @default - The default schedule group is used.
   */
  readonly groupName?: string;

  /**
   * The customer managed KMS key that EventBridge Scheduler will use to encrypt and decrypt payload.
   *
   * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/encryption-rest.html
   *
   * @default - Use automatically generated KMS key
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The schedule that defines when the schedule will trigger.
   *
   * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html
   */
  readonly schedule: Schedule;

  /**
   * The timezone in which the scheduling expression is evaluated.
   *
   * @default - UTC
   */
  readonly timezone?: string;

  /**
   * The date, in UTC, after which the schedule can begin invoking its target.
   * Depending on the schedule's recurrence expression, invocations might occur on, or after, the StartDate you specify.
   * EventBridge Scheduler ignores StartDate for one-time schedules.
   *
   * @default - No start date
   */
  readonly startDate?: Date;

  /**
   * Specifies whether the schedule is enabled or disabled.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The schedule's target.
   */
  readonly target: EventBridgeSchedulerTarget;
}

/**
 * Properties for `EventBridgeSchedulerTarget`
 *
 * @see https://docs.aws.amazon.com/scheduler/latest/APIReference/API_Target.html#API_Target_Contents
 */
export interface EventBridgeSchedulerTargetProps {
  /**
   * The Amazon Resource Name (ARN) of the target.
   *
   * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-targets.html
   */
  readonly arn: string;

  /**
  * The IAM role that EventBridge Scheduler will use for this target when the schedule is invoked.
  */
  readonly role: iam.IRole;

  /**
  * The input to the target.
  *
  * @default - EventBridge Scheduler delivers a default notification to the target
  */
  readonly input?: string;

  /**
  * The retry policy settings
  *
  * @default - Do not retry
  */
  readonly retryPolicy?: RetryPolicy;

  /**
  * Dead letter queue for failed events
  *
  * @default - No dead letter queue
  */
  readonly deadLetterQueue?: sqs.IQueue;
}

/**
 * The target that EventBridge Scheduler will invoke
 */
export class EventBridgeSchedulerTarget {
  /**
   * The Amazon Resource Name (ARN) of the target
   */
  public arn: string;
  /**
   * The IAM role that EventBridge Scheduler will use for this target when the schedule is invoked
   */
  public role: iam.IRole;
  /**
   * The input to the target
   */
  public input?: string;
  /**
   * The retry policy settings
   */
  public retryPolicy?: RetryPolicy;
  /**
   * Dead letter queue for failed events
   */
  public deadLetterQueue?: sqs.IQueue;

  constructor(props: EventBridgeSchedulerTargetProps) {
    this.validateProps(props);
    this.arn = props.arn;
    this.role = props.role;
    this.input = props.input;
    this.retryPolicy = props.retryPolicy;
    this.deadLetterQueue = props.deadLetterQueue;
  }

  /**
   * return the target object for the EventBridge Scheduler
   */
  public renderTargetObject(): any {
    return {
      Arn: this.arn,
      RoleArn: this.role.roleArn,
      Input: this.input,
      RetryPolicy: this.retryPolicy ? {
        MaximumEventAgeInSeconds: this.retryPolicy.maximumEventAge.toSeconds(),
        MaximumRetryAttempts: this.retryPolicy.maximumRetryAttempts,
      } : undefined,
      DeadLetterConfig: this.deadLetterQueue ? {
        Arn: this.deadLetterQueue.queueArn,
      } : undefined,
    };
  }

  private validateProps(props: EventBridgeSchedulerTargetProps) {
    if (props.input !== undefined && !Token.isUnresolved(props.input) && props.input.length < 1) {
      throw new Error('Input must be at least 1 character long.');
    }

    if (props.retryPolicy) {
      if (
        !Number.isInteger(props.retryPolicy.maximumRetryAttempts) ||
        props.retryPolicy.maximumRetryAttempts < 0 ||
        props.retryPolicy.maximumRetryAttempts > 185
      ) {
        throw new Error(`MaximumRetryAttempts must be an integer between 0 and 185, got ${props.retryPolicy.maximumRetryAttempts}`);
      }
      if (
        props.retryPolicy.maximumEventAge.toMilliseconds() < Duration.seconds(60).toMilliseconds() ||
        props.retryPolicy.maximumEventAge.toSeconds() > 86400
      ) {
        throw new Error('MaximumEventAgeInSeconds must be between 60 and 86400 seconds');
      }
    }
  }
}

/**
 * The information about the retry policy settings
 */
export interface RetryPolicy {
  /**
   * The maximum number of retry attempts to make before the request fails.
   */
  readonly maximumRetryAttempts: number;

  /**
   * The maximum amount of time to continue to make retry attempts.
   */
  readonly maximumEventAge: Duration;
}

/**
 * Create a new AWS EventBridge Scheduler schedule
 *
 * @see https://docs.aws.amazon.com/scheduler/latest/APIReference/API_CreateSchedule.html
 */
export class EventBridgeSchedulerCreateScheduleTask extends sfn.TaskStateBase {

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EventBridgeSchedulerCreateScheduleTaskProps) {
    super(scope, id, props);

    this.validateProps(props);

    props.kmsKey?.grantDecrypt(props.target.role);

    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;
    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: [
          Stack.of(this).formatArn({
            service: 'scheduler',
            resource: 'schedule',
            resourceName: `${this.props.groupName ?? 'default'}/${this.props.scheduleName}`,
          }),
        ],
        actions: [
          'scheduler:CreateSchedule',
        ],
      }),
      new iam.PolicyStatement({
        resources: [props.target.role.roleArn],
        actions: [
          'iam:PassRole',
        ],
      }),
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('aws-sdk:scheduler', 'createSchedule', this.integrationPattern),
      Parameters: {
        ActionAfterCompletion: this.props.actionAfterCompletion ?? ActionAfterCompletion.NONE,
        ClientToken: this.props.clientToken,
        Description: this.props.description,
        EndDate: this.props.endDate ? this.props.endDate.toISOString() : undefined,
        FlexibleTimeWindow: {
          Mode: this.props.flexibleTimeWindow ? 'FLEXIBLE' : 'OFF',
          MaximumWindowInMinutes: this.props.flexibleTimeWindow?.toMinutes(),
        },
        GroupName: this.props.groupName,
        KmsKeyArn: this.props.kmsKey?.keyArn,
        Name: this.props.scheduleName,
        ScheduleExpression: this.props.schedule.expressionString,
        ScheduleExpressionTimezone: this.props.timezone,
        StartDate: this.props.startDate ? this.props.startDate.toISOString() : undefined,
        State: (this.props.enabled ?? true) ? 'ENABLED' : 'DISABLED',
        Target: this.props.target.renderTargetObject(),
      },
    };
  }

  private validateProps(props: EventBridgeSchedulerCreateScheduleTaskProps) {
    if (props.startDate && props.endDate && props.startDate >= props.endDate) {
      throw new Error('\'startDate\' must be before \'endDate\'');
    }

    if (props.clientToken !== undefined && !Token.isUnresolved(props.clientToken)) {
      if (props.clientToken.length > 64 || props.clientToken.length < 1) {
        throw new Error(`ClientToken must be between 1 and 64 characters long. Got: ${props.clientToken.length}`);
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(props.clientToken)) {
        throw new Error(`ClientToken must consist of alphanumeric characters, dashes, and underscores only, Got: ${props.clientToken}`);
      }
    }

    if (props.description !== undefined && !Token.isUnresolved(props.description) && props.description.length > 512) {
      throw new Error(`Description must be less than 512 characters long. Got: ${props.description.length}`);
    }

    if (props.flexibleTimeWindow && (
      // To handle durations of less than one minute, comparisons will be made in milliseconds
      props.flexibleTimeWindow.toMilliseconds() < Duration.minutes(1).toMilliseconds() ||
      props.flexibleTimeWindow.toMinutes() > 1440
    )) {
      throw new Error('FlexibleTimeWindow must be between 1 and 1440 minutes');
    }

    if (props.groupName !== undefined && !Token.isUnresolved(props.groupName)) {
      if (props.groupName.length < 1 || props.groupName.length > 64) {
        throw new Error(`GroupName must be between 1 and 64 characters long. Got: ${props.groupName.length}`);
      }
      if (!/^[a-zA-Z0-9-_.]+$/.test(props.groupName)) {
        throw new Error(`GroupName must consist of alphanumeric characters, dashes, underscores, and periods only, Got: ${props.groupName}`);
      }
    }

    if (props.timezone !== undefined && !Token.isUnresolved(props.timezone) && (props.timezone.length < 1 || props.timezone.length > 50)) {
      throw new Error(`Timezone must be between 1 and 50 characters long. Got: ${props.timezone.length}`);
    }
  }
}
