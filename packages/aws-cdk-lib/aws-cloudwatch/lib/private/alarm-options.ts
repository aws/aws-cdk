import type { Construct } from 'constructs';
import type * as cdk from '../../../core';
import { Token, ValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import type { TreatMissingData } from '../alarm';
import type { AlarmWarmupConfiguration } from '../alarm-base';
import type { CfnAlarm } from '../cloudwatch.generated';

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
   * @default - No warm-up period
   */
  readonly warmupConfiguration?: AlarmWarmupConfiguration;

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
}

/**
 * Render and validate an alarm warm-up configuration.
 *
 * @internal
 */
export function renderAlarmWarmupConfiguration(
  scope: Construct,
  configuration?: AlarmWarmupConfiguration,
): CfnAlarm.WarmUpConfigurationProperty | undefined {
  const warmupPeriodInMinutes = configuration?.warmupPeriod.toMinutes();
  if (
    warmupPeriodInMinutes !== undefined
    && !Token.isUnresolved(warmupPeriodInMinutes)
    && (warmupPeriodInMinutes < 1 || warmupPeriodInMinutes > 2880)
  ) {
    throw new ValidationError(
      lit`AlarmWarmupPeriodOutOfRange`,
      `warmupPeriod must be between 1 and 2880 minutes, got ${warmupPeriodInMinutes}`,
      scope,
    );
  }

  return configuration ? {
    onlyStartEvaluatingAfterWarmUpPeriodEnds: configuration.onlyStartEvaluatingAfterWarmupPeriodEnds,
    warmUpPeriodDurationInMinutes: warmupPeriodInMinutes,
  } : undefined;
}
