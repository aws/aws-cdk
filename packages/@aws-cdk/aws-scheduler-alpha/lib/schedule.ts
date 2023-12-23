import { Duration, IResource, Resource } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as kms from 'aws-cdk-lib/aws-kms';
import { CfnSchedule } from 'aws-cdk-lib/aws-scheduler';
import { Construct } from 'constructs';
import { IGroup } from './group';
import { ScheduleTargetInput } from './input';
import { ScheduleExpression } from './schedule-expression';
import { IScheduleTarget } from './target';

/**
 * Interface representing a created or an imported `Schedule`.
 */
export interface ISchedule extends IResource {
  /**
   * The name of the schedule.
   */
  readonly scheduleName: string;

  /**
   * The schedule group associated with this schedule.
   */
  readonly group?: IGroup;

  /**
   * The arn of the schedule.
   */
  readonly scheduleArn: string;

  /**
   * The customer managed KMS key that EventBridge Scheduler will use to encrypt and decrypt your data.
   */
  readonly key?: kms.IKey;
}

export interface ScheduleTargetProps {
  /**
   * The text, or well-formed JSON, passed to the target.
   *
   * If you are configuring a templated Lambda, AWS Step Functions, or Amazon EventBridge target,
   * the input must be a well-formed JSON. For all other target types, a JSON is not required.
   *
   * @default - The target's input is used.
   */
  readonly input?: ScheduleTargetInput;

  /**
   * The maximum amount of time, in seconds, to continue to make retry attempts.
   *
   * @default - The target's maximumEventAgeInSeconds is used.
   */
  readonly maxEventAge?: Duration;

  /**
   * The maximum number of retry attempts to make before the request fails.
   *
   * @default - The target's maximumRetryAttempts is used.
   */
  readonly retryAttempts?: number;
}

/**
 * A time window during which EventBridge Scheduler invokes the schedule.
 */
export class TimeWindow {
  /**
   * TimeWindow is disabled.
   */
  public static off(): TimeWindow {
    return new TimeWindow('OFF');
  }

  /**
   * TimeWindow is enabled.
   */
  public static flexible(maxWindow: Duration): TimeWindow {
    if (maxWindow.toMinutes() < 1 || maxWindow.toMinutes() > 1440) {
      throw new Error(`The provided duration must be between 1 minute and 1440 minutes, got ${maxWindow.toMinutes()}`);
    }
    return new TimeWindow('FLEXIBLE', maxWindow);
  }

  /**
   * Determines whether the schedule is invoked within a flexible time window.
   */
  public readonly mode: 'OFF' | 'FLEXIBLE';

  /**
   * The maximum time window during which the schedule can be invoked.
   *
   * Must be between 1 to 1440 minutes.
   *
   * @default - no value
   */
  public readonly maxWindow?: Duration;

  private constructor(mode: 'OFF' | 'FLEXIBLE', maxWindow?: Duration) {
    this.mode = mode;
    this.maxWindow = maxWindow;
  }
}

/**
 * Construction properties for `Schedule`.
 */
export interface ScheduleProps {
  /**
   * The expression that defines when the schedule runs. Can be either a `at`, `rate`
   * or `cron` expression.
   */
  readonly schedule: ScheduleExpression;

  /**
   * The schedule's target details.
   */
  readonly target: IScheduleTarget;

  /**
   * Allows to override target properties when creating a new schedule.
   */
  readonly targetOverrides?: ScheduleTargetProps;

  /**
   * The name of the schedule.
   *
   * Up to 64 letters (uppercase and lowercase), numbers, hyphens, underscores and dots are allowed.
   *
   * @default - A unique name will be generated
   */
  readonly scheduleName?: string;

  /**
   * The description you specify for the schedule.
   *
   * @default - no value
   */
  readonly description?: string;

  /**
   * The schedule's group.
   *
   * @default - By default a schedule will be associated with the `default` group.
   */
  readonly group?: IGroup;

  /**
   * Indicates whether the schedule is enabled.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The customer managed KMS key that EventBridge Scheduler will use to encrypt and decrypt your data.
   *
   * @default - All events in Scheduler are encrypted with a key that AWS owns and manages.
   */
  readonly key?: kms.IKey;

  /**
   * A time window during which EventBridge Scheduler invokes the schedule.
   *
   * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-schedule-flexible-time-windows.html
   *
   * @default TimeWindow.off()
   */
  readonly timeWindow?: TimeWindow;

  /**
   * The date, in UTC, after which the schedule can begin invoking its target.
   * EventBridge Scheduler ignores start for one-time schedules.
   *
   * @default - no value
   */
  readonly start?: Date;

  /**
   * The date, in UTC, before which the schedule can invoke its target.
   * EventBridge Scheduler ignores end for one-time schedules.
   *
   * @default - no value
   */
  readonly end?: Date;
}

/**
 * An EventBridge Schedule
 */
export class Schedule extends Resource implements ISchedule {
  /**
   * Return the given named metric for all schedules.
   *
   * @default - sum over 5 minutes
   */
  public static metricAll(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/Scheduler',
      metricName,
      statistic: 'sum',
      ...props,
    });
  }

  /**
   * Metric for the number of invocations that were throttled across all schedules.
   *
   * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/scheduler-quotas.html
   *
   * @default - sum over 5 minutes
   */
  public static metricAllThrottled(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('InvocationThrottleCount', props);
  }

  /**
   * Metric for all invocation attempts across all schedules.
   *
   * @default - sum over 5 minutes
   */
  public static metricAllAttempts(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('InvocationAttemptCount', props);
  }
  /**
   * Emitted when the target returns an exception after EventBridge Scheduler calls the target API across all schedules.
   *
   * @default - sum over 5 minutes
   */
  public static metricAllErrors(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('TargetErrorCount', props);
  }

  /**
   * Metric for invocation failures due to API throttling by the target across all schedules.
   *
   * @default - sum over 5 minutes
   */
  public static metricAllTargetThrottled(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('TargetErrorThrottledCount', props);
  }

  /**
   * Metric for dropped invocations when EventBridge Scheduler stops attempting to invoke the target after a schedule's retry policy has been exhausted.
   * Metric is calculated for all schedules.
   *
   * @default - sum over 5 minutes
   */
  public static metricAllDropped(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('InvocationDroppedCount', props);
  }

  /**
   * Metric for invocations delivered to the DLQ across all schedules.
   *
   * @default - sum over 5 minutes
   */
  public static metricAllSentToDLQ(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('InvocationsSentToDeadLetterCount', props);
  }

  /**
   * Metric for failed invocations that also failed to deliver to DLQ across all schedules.
   *
   * @default - sum over 5 minutes
   */
  public static metricAllFailedToBeSentToDLQ(errorCode?: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    if (errorCode) {
      return this.metricAll(`InvocationsFailedToBeSentToDeadLetterCount_${errorCode}`, props);
    }

    return this.metricAll('InvocationsFailedToBeSentToDeadLetterCount', props);
  }

  /**
   * Metric for delivery of failed invocations to DLQ when the payload of the event sent to the DLQ exceeds the maximum size allowed by Amazon SQS.
   * Metric is calculated for all schedules.
   *
   * @default - sum over 5 minutes
   */
  public static metricAllSentToDLQTruncated(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('InvocationsSentToDeadLetterCount_Truncated_MessageSizeExceeded', props);
  }

  /**
   * The schedule group associated with this schedule.
   */
  public readonly group?: IGroup;

  /**
   * The arn of the schedule.
   */
  public readonly scheduleArn: string;

  /**
   * The name of the schedule.
   */
  public readonly scheduleName: string;

  /**
   * The customer managed KMS key that EventBridge Scheduler will use to encrypt and decrypt your data.
   */
  readonly key?: kms.IKey;

  /**
   * A `RetryPolicy` object that includes information about the retry policy settings.
   */
  private readonly retryPolicy?: CfnSchedule.RetryPolicyProperty;

  constructor(scope: Construct, id: string, props: ScheduleProps) {
    super(scope, id, {
      physicalName: props.scheduleName,
    });

    this.group = props.group;

    const targetConfig = props.target.bind(this);

    this.key = props.key;
    if (this.key) {
      this.key.grantEncryptDecrypt(targetConfig.role);
    }

    this.retryPolicy = targetConfig.retryPolicy;

    const flexibleTimeWindow = props.timeWindow ?? TimeWindow.off();

    this.validateTimeFrame(props.start, props.end);

    const resource = new CfnSchedule(this, 'Resource', {
      name: this.physicalName,
      flexibleTimeWindow: {
        mode: flexibleTimeWindow.mode,
        maximumWindowInMinutes: flexibleTimeWindow.maxWindow?.toMinutes(),
      },
      scheduleExpression: props.schedule.expressionString,
      scheduleExpressionTimezone: props.schedule.timeZone?.timezoneName,
      groupName: this.group?.groupName,
      state: (props.enabled ?? true) ? 'ENABLED' : 'DISABLED',
      kmsKeyArn: this.key?.keyArn,
      target: {
        arn: targetConfig.arn,
        roleArn: targetConfig.role.roleArn,
        input: props.targetOverrides?.input ?
          props.targetOverrides?.input?.bind(this) :
          targetConfig.input?.bind(this),
        deadLetterConfig: targetConfig.deadLetterConfig,
        retryPolicy: this.renderRetryPolicy(props.targetOverrides?.maxEventAge?.toSeconds(), props.targetOverrides?.retryAttempts),
        ecsParameters: targetConfig.ecsParameters,
        kinesisParameters: targetConfig.kinesisParameters,
        eventBridgeParameters: targetConfig.eventBridgeParameters,
        sageMakerPipelineParameters: targetConfig.sageMakerPipelineParameters,
        sqsParameters: targetConfig.sqsParameters,
      },
      startDate: props.start?.toISOString(),
      endDate: props.end?.toISOString(),
    });

    this.scheduleName = this.getResourceNameAttribute(resource.ref);
    this.scheduleArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'scheduler',
      resource: 'schedule',
      resourceName: `${this.group?.groupName ?? 'default'}/${this.physicalName}`,
    });
  }

  private renderRetryPolicy(
    maximumEventAgeInSeconds?: number,
    maximumRetryAttempts?: number,
  ): CfnSchedule.RetryPolicyProperty | undefined {
    const policy = {
      ...this.retryPolicy,
      maximumEventAgeInSeconds: maximumEventAgeInSeconds ?? this.retryPolicy?.maximumEventAgeInSeconds,
      maximumRetryAttempts: maximumRetryAttempts ?? this.retryPolicy?.maximumRetryAttempts,
    };

    if (policy.maximumEventAgeInSeconds && (policy.maximumEventAgeInSeconds < 60 || policy.maximumEventAgeInSeconds > 86400)) {
      throw new Error(`maximumEventAgeInSeconds must be between 60 and 86400, got ${policy.maximumEventAgeInSeconds}`);
    }
    if (policy.maximumRetryAttempts && (policy.maximumRetryAttempts < 0 || policy.maximumRetryAttempts > 185)) {
      throw new Error(`maximumRetryAttempts must be between 0 and 185, got ${policy.maximumRetryAttempts}`);
    }

    const isEmptyPolicy = Object.values(policy).every(value => value === undefined);
    return !isEmptyPolicy ? policy : undefined;
  }

  private validateTimeFrame(start?: Date, end?: Date) {
    if (start && end && start >= end) {
      throw new Error(`start must precede end, got start: ${start.toISOString()}, end: ${end.toISOString()}`);
    }
  }
}
