import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as kms from '../../../aws-kms';
import * as sqs from '../../../aws-sqs';
import * as sfn from '../../../aws-stepfunctions';
import { Stack, Duration, Token } from '../../../core';
import { integrationResourceArn } from '../private/task-utils';

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
export interface CreateScheduleProps extends sfn.TaskStateBaseProps {
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
   * Depending on the schedule's recurrence expression, invocations might stop on, or before, the EndDate you specify. EventBridge Scheduler ignores EndDate for one-time schedules.
   *
   * @default - No end date
   */
  readonly endDate?: Date;

  /**
   * The maximum time window during which a schedule can be invoked.
   *
   * @default - Disable flexible time window
   */
  readonly flexibleTimeWindow?: Duration;

  /**
   * Existing schedule group name
   *
   * @default 'default'
   */
  readonly groupName?: string;

  /**
   * The customer managed KMS key that EventBridge Scheduler will use to encrypt and decrypt your data.
   *
   * @default - use automatically generated KMS key
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The expression that defines when the schedule runs.
   *
   * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html
   */
  readonly scheduleExpression: string;

  /**
   * The timezone in which the scheduling expression is evaluated.
   *
   * @default - UTC
   */
  readonly timezone?: string;

  /**
   * The date, in UTC, after which the schedule can begin invoking its target.
   * Depending on the schedule's recurrence expression, invocations might occur on, or after, the StartDate you specify. EventBridge Scheduler ignores StartDate for one-time schedules.
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
   * The Amazon Resource Name (ARN) of the target.
   */
  readonly targetArn: string;

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

  constructor(scope: Construct, id: string, private readonly props: CreateScheduleProps) {
    super(scope, id, props);

    this.validateProps(props);

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
        resources: [props.role.roleArn],
        actions: [
          'iam:PassRole',
        ],
      }),
    ];
  }

  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('aws-sdk:scheduler', 'createSchedule', this.integrationPattern),
      Parameters: {
        ActionAfterCompletion: this.props.actionAfterCompletion,
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
        ScheduleExpression: this.props.scheduleExpression,
        ScheduleExpressionTimezone: this.props.timezone,
        StartDate: this.props.startDate ? this.props.startDate.toISOString() : undefined,
        State: (this.props.enabled ?? true) ? 'ENABLED' : 'DISABLED',
        Target: {
          Arn: this.props.targetArn,
          RoleArn: this.props.role.roleArn,
          Input: this.props.input,
          RetryPolicy: this.props.retryPolicy ? {
            MaximumEventAgeInSeconds: this.props.retryPolicy.maximumEventAge.toSeconds(),
            MaximumRetryAttempts: this.props.retryPolicy.maximumRetryAttempts,
          } : undefined,
          DeadLetterConfig: this.props.deadLetterQueue ? {
            Arn: this.props.deadLetterQueue.queueArn,
          } : undefined,
        },
      },
    };
  }

  private validateProps(props: CreateScheduleProps) {
    if (
      props.clientToken !== undefined &&
      !Token.isUnresolved(props.clientToken) &&
      (props.clientToken.length > 64 || props.clientToken.length < 1)) {
      throw new Error(`ClientToken must be between 1 and 64 characters long. Got: ${props.clientToken.length}`);
    }

    if (props.description !== undefined && !Token.isUnresolved(props.description) && props.description.length > 512) {
      throw new Error(`Description must be less than 512 characters long. Got: ${props.description.length}`);
    }

    if (props.flexibleTimeWindow && (props.flexibleTimeWindow.toMinutes() < 1 || props.flexibleTimeWindow.toMinutes() > 1440)) {
      throw new Error('FlexibleTimeWindow must be between 1 and 1440 minutes');
    }

    if (props.groupName !== undefined && !Token.isUnresolved(props.groupName) && (props.groupName.length > 64 || props.groupName.length < 1)) {
      throw new Error(`GroupName must be between 1 and 64 characters long. Got: ${props.groupName.length}`);
    }
  }
}