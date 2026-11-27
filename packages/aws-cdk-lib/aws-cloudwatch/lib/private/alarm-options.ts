import type { Construct } from 'constructs';
import type * as cdk from '../../../core';
import { Token, ValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import type { TreatMissingData } from '../alarm';
import type { AlarmWarmUpConfiguration } from '../alarm-base';
import type { CfnAlarm } from '../cloudwatch.generated';
import type { EvaluationWindow } from '../evaluation-window';

/**
 * Base options for creating CloudWatch alarms
 *
 * @internal
 */
export interface CreateAlarmOptionsBase {
  /**
   * The period over which the specified statistic is applied.
   *
   * Cannot be used with `MathExpression` objects.
   *
   * @default - The period from the metric
   * @deprecated Use `metric.with({ period: ... })` to encode the period into the Metric object
   */
  readonly period?: cdk.Duration;

  /**
   * What function to use for aggregating.
   *
   * Can be one of the following:
   *
   * - "Minimum" | "min"
   * - "Maximum" | "max"
   * - "Average" | "avg"
   * - "Sum" | "sum"
   * - "SampleCount | "n"
   * - "pNN.NN"
   *
   * Cannot be used with `MathExpression` objects.
   *
   * @default - The statistic from the metric
   * @deprecated Use `metric.with({ statistic: ... })` to encode the period into the Metric object
   */
  readonly statistic?: string;

  /**
   * Name of the alarm
   *
   * @default Automatically generated name
   */
  readonly alarmName?: string;

  /**
   * Description for the alarm
   *
   * @default No description
   */
  readonly alarmDescription?: string;

  /**
   * The number of periods over which data is compared to the specified threshold.
   */
  readonly evaluationPeriods: number;

  /**
   * Specifies whether to evaluate the data and potentially change the alarm state if there are too few data points to be statistically significant.
   *
   * Used only for alarms that are based on percentiles.
   *
   * @default - Not configured.
   */
  readonly evaluateLowSampleCountPercentile?: string;

  /**
   * Sets how this alarm is to handle missing data points.
   *
   * @default TreatMissingData.Missing
   */
  readonly treatMissingData?: TreatMissingData;

  /**
   * The warm-up configuration for the alarm.
   *
   * A warm-up period keeps a newly created alarm in `INSUFFICIENT_DATA`, without performing alarm actions,
   * until the period ends or enough metric data is available. Warm-up starts only when the alarm is created;
   * adding or changing this configuration on an existing alarm whose warm-up has ended does not start a new one.
   *
   * Available for metric alarms, including metric math, Metrics Insights queries (with or without `GROUP BY`)
   * and anomaly detection.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-warm-up.html
   *
   * @default - No warm-up period
   */
  readonly warmUpConfiguration?: AlarmWarmUpConfiguration;

  /**
   * Whether the actions for this alarm are enabled
   *
   * @default true
   */
  readonly actionsEnabled?: boolean;

  /**
   * The number of datapoints that must be breaching to trigger the alarm. This is used only if you are setting an "M
   * out of N" alarm. In that case, this value is the M. For more information, see Evaluating an Alarm in the Amazon
   * CloudWatch User Guide.
   *
   * @default ``evaluationPeriods``
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation
   */
  readonly datapointsToAlarm?: number;

  /**
   * The evaluation window the alarm uses to select the range of metric data it evaluates.
   *
   * Use `EvaluationWindow.wallClockWindow()` to align the evaluated range to fixed clock
   * boundaries that match the alarm's period (the top of the hour, midnight, or the start of
   * the calendar week), optionally in a given time zone. Use `EvaluationWindow.slidingWindow()`
   * for the default behavior of evaluating the most recent data points as they arrive.
   *
   * With a wall clock window, all metric periods must be one of 1 minute, 5 minutes, 1 hour,
   * 1 day, or 1 week. Wall clock windows are not available for high-resolution alarms. For
   * Metrics Insights alarms, CloudWatch reserves one extra period to align the window, so
   * `period x (evaluationPeriods + 1)` must be 3 hours or less (a 1-hour period allows at most
   * 2 evaluation periods).
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-evaluation-window.html
   *
   * @default - The alarm uses a sliding window.
   */
  readonly evaluationWindow?: EvaluationWindow;
}

/**
 * Render and validate an alarm warm-up configuration.
 *
 * @internal
 */
export function renderAlarmWarmUpConfiguration(
  scope: Construct,
  configuration?: AlarmWarmUpConfiguration,
): CfnAlarm.WarmUpConfigurationProperty | undefined {
  const warmUpPeriodInMinutes = configuration?.warmUpPeriod.toMinutes();
  if (
    warmUpPeriodInMinutes !== undefined
    && !Token.isUnresolved(warmUpPeriodInMinutes)
    && (warmUpPeriodInMinutes < 1 || warmUpPeriodInMinutes > 2880)
  ) {
    throw new ValidationError(
      lit`AlarmWarmUpPeriodOutOfRange`,
      `warmUpPeriod must be between 1 and 2880 minutes, got ${warmUpPeriodInMinutes}`,
      scope,
    );
  }

  return configuration ? {
    onlyStartEvaluatingAfterWarmUpPeriodEnds: configuration.onlyStartEvaluatingAfterWarmUpPeriodEnds,
    warmUpPeriodDurationInMinutes: warmUpPeriodInMinutes,
  } : undefined;
}
