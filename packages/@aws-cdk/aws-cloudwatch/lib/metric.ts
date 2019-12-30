import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Alarm, ComparisonOperator, TreatMissingData } from './alarm';
import { Dimension, IMetric, MetricAlarmConfig, MetricConfig, MetricGraphConfig, Unit } from './metric-types';
import { normalizeStatistic, parseStatistic } from './util.statistic';

export type DimensionHash = {[dim: string]: any};

/**
 * Options shared by most methods accepting metric options
 */
export interface CommonMetricOptions {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(5)
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
   * @default Average
   */
  readonly statistic?: string;

  /**
   * Dimensions of the metric
   *
   * @default - No dimensions.
   */
  readonly dimensions?: DimensionHash;

  /**
   * Unit for the metric that is associated with the alarm
   */
  readonly unit?: Unit;

  /**
   * Label for this metric when added to a Graph in a Dashboard
   */
  readonly label?: string;

  /**
   * Color for this metric when added to a Graph in a Dashboard
   */
  readonly color?: string;
}

/**
 * Properties for a metric
 */
export interface MetricProps extends CommonMetricOptions {
  /**
   * Namespace of the metric.
   */
  readonly namespace: string;

  /**
   * Name of the metric.
   */
  readonly metricName: string;

  /**
   * Account which this metric comes from.
   */
  readonly account?: string;

  /**
   * Region which this metric comes from.
   */
  readonly region?: string;
}

/**
 * Properties of a metric that can be changed
 */
export interface MetricOptions extends CommonMetricOptions {
  /**
   * Account which this metric comes from.
   */
  readonly account?: string;

  /**
   * Region which this metric comes from.
   */
  readonly region?: string;
}

export interface MathExpressionProps extends CommonMetricOptions {
  readonly expression: string;

  readonly expressionMetrics: Record<string, IMetric>;
}

/**
 * A metric emitted by a service
 *
 * The metric is a combination of a metric identifier (namespace, name and dimensions)
 * and an aggregation function (statistic, period and unit).
 *
 * It also contains metadata which is used only in graphs, such as color and label.
 * It makes sense to embed this in here, so that compound constructs can attach
 * that metadata to metrics they expose.
 *
 * This class does not represent a resource, so hence is not a construct. Instead,
 * Metric is an abstraction that makes it easy to specify metrics for use in both
 * alarms and graphs.
 */
export class Metric implements IMetric {
  /**
   * Grant permissions to the given identity to write metrics.
   *
   * @param grantee The IAM identity to give permissions to.
   */
  public static grantPutMetricData(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['cloudwatch:PutMetricData'],
      resourceArns: ['*']
    });
  }

  public readonly dimensions?: DimensionHash;
  public readonly namespace: string;
  public readonly metricName: string;
  public readonly period: cdk.Duration;
  public readonly statistic: string;
  public readonly unit?: Unit;
  public readonly label?: string;
  public readonly color?: string;
  public readonly account?: string;
  public readonly region?: string;

  constructor(props: MetricProps) {
    this.period = props.period || cdk.Duration.minutes(5);
    const periodSec = this.period.toSeconds();
    if (periodSec !== 1 && periodSec !== 5 && periodSec !== 10 && periodSec !== 30 && periodSec % 60 !== 0) {
      throw new Error(`'period' must be 1, 5, 10, 30, or a multiple of 60 seconds, received ${props.period}`);
    }

    this.dimensions = props.dimensions;
    this.namespace = props.namespace;
    this.metricName = props.metricName;
    // Try parsing, this will throw if it's not a valid stat
    this.statistic = normalizeStatistic(props.statistic || "Average");
    this.label = props.label;
    this.color = props.color;
    this.unit = props.unit;
    this.account = props.account;
    this.region = props.region;
  }

  /**
   * Return a copy of Metric with properties changed.
   *
   * All properties except namespace and metricName can be changed.
   *
   * @param props The set of properties to change.
   */
  public with(props: MetricOptions): Metric {
    return new Metric({
      dimensions: ifUndefined(props.dimensions, this.dimensions),
      namespace: this.namespace,
      metricName: this.metricName,
      period: ifUndefined(props.period, this.period),
      statistic: ifUndefined(props.statistic, this.statistic),
      unit: ifUndefined(props.unit, this.unit),
      label: ifUndefined(props.label, this.label),
      color: ifUndefined(props.color, this.color),
      account: this.account,
      region: this.region
    });
  }

  /**
   * Make a new Alarm for this metric
   *
   * Combines both properties that may adjust the metric (aggregation) as well
   * as alarm properties.
   */
  public createAlarm(scope: cdk.Construct, id: string, props: CreateAlarmOptions): Alarm {
    return new Alarm(scope, id, {
      metric: this.with({
        statistic: props.statistic,
        period: props.period,
      }),
      alarmName: props.alarmName,
      alarmDescription: props.alarmDescription,
      comparisonOperator: props.comparisonOperator,
      datapointsToAlarm: props.datapointsToAlarm,
      threshold: props.threshold,
      evaluationPeriods: props.evaluationPeriods,
      evaluateLowSampleCountPercentile: props.evaluateLowSampleCountPercentile,
      treatMissingData: props.treatMissingData,
      actionsEnabled: props.actionsEnabled,
    });
  }

  public toAlarmConfig(): MetricAlarmConfig {
    const metricConfig = this.toMetricConfig();
    if (metricConfig.metricStat === undefined) {
      throw new Error("MetricStat must be set.");
    }

    const stat = parseStatistic(metricConfig.metricStat.statistic);
    return {
      dimensions: metricConfig.metricStat.dimensions,
      namespace: metricConfig.metricStat.namespace,
      metricName: metricConfig.metricStat.metricName,
      period: metricConfig.metricStat.period,
      statistic: stat.type === 'simple' ? stat.statistic : undefined,
      extendedStatistic: stat.type === 'percentile' ? 'p' + stat.percentile : undefined,
      unit: this.unit
    };
  }

  public toGraphConfig(): MetricGraphConfig {
    const metricConfig = this.toMetricConfig();
    if (metricConfig.metricStat === undefined) {
      throw new Error("MetricStatConfig need to set");
    }

    return {
      dimensions: metricConfig.metricStat.dimensions,
      namespace: metricConfig.metricStat.namespace,
      metricName: metricConfig.metricStat.metricName,
      renderingProperties: {
        period: metricConfig.metricStat.period,
        stat: metricConfig.metricStat.statistic,
        color: metricConfig.renderingProperties?.color,
        label: metricConfig.renderingProperties?.label
      },
      // deprecated properties for backwards compatibility
      period: metricConfig.metricStat.period,
      statistic: metricConfig.metricStat.statistic,
      color: metricConfig.renderingProperties?.color,
      label: metricConfig.renderingProperties?.label,
      unit: this.unit
    };
  }

  public toMetricConfig(): MetricConfig {
    return {
      metricStat: {
        dimensions: this.dimensionsAsList(),
        namespace: this.namespace,
        metricName: this.metricName,
        period: this.period.toSeconds(),
        statistic: this.statistic,
        account: this.account,
        region: this.region
      },
      renderingProperties: {
        color: this.color,
        label: this.label
      }
    };
  }

  public toString() {
    return this.label || this.metricName;
  }

  /**
   * Return the dimensions of this Metric as a list of Dimension.
   */
  private dimensionsAsList(): Dimension[] {
    const dims = this.dimensions;

    if (dims === undefined) {
      return [];
    }

    const list = Object.keys(dims).sort().map(key => ({ name: key, value: dims[key] }));

    return list;
  }
}

/**
 * A math expression built with metric(s) emitted by a service
 *
 * The math expression is a combination of an expression (x+y) and metrics to apply expression on.
 * It also contains metadata which is used only in graphs, such as color and label.
 * It makes sense to embed this in here, so that compound constructs can attach
 * that metadata to metrics they expose.
 *
 * This class does not represent a resource, so hence is not a construct. Instead,
 * MathExpression is an abstraction that makes it easy to specify metrics for use in both
 * alarms and graphs.
 */
export class MathExpression implements IMetric {
  /**
   * Grant permissions to the given identity to write metrics.
   *
   * @param grantee The IAM identity to give permissions to.
   */
  public static grantPutMetricData(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['cloudwatch:PutMetricData'],
      resourceArns: ['*']
    });
  }

  public readonly expression: string;
  public readonly expressionMetrics: Record<string, IMetric>;
  public readonly period: cdk.Duration;
  public readonly label?: string;
  public readonly color?: string;

  constructor(props: MathExpressionProps) {
    this.expression = props.expression;
    this.expressionMetrics = props.expressionMetrics;
    this.label = props.label;
    this.color = props.color;
    this.period = this.getPeriod();

    const periodSec = this.period.toSeconds();
    if (periodSec !== 1 && periodSec !== 5 && periodSec !== 10 && periodSec !== 30 && periodSec % 60 !== 0) {
      throw new Error(`'period' must be 1, 5, 10, 30, or a multiple of 60 seconds, received ${props.period}`);
    }
  }

  /**
   * Return a copy of Metric with properties changed.
   *
   * All properties except namespace and metricName can be changed.
   *
   * @param props The set of properties to change.
   */
  public with(props: MetricOptions): MathExpression {
    return new MathExpression({
      expression: this.expression,
      expressionMetrics: this.expressionMetrics,
      label: ifUndefined(props.label, this.label),
      color: ifUndefined(props.color, this.color)
    });
  }

  /**
   * Make a new Alarm for this metric
   *
   * Combines both properties that may adjust the metric (aggregation) as well
   * as alarm properties.
   */
  // public createAlarm(scope: cdk.Construct, id: string, props: CreateAlarmOptions): Alarm {
  //   //TODO
  // }

  public toAlarmConfig(): MetricAlarmConfig {
    throw new Error("This method is depricated");
  }

  public toGraphConfig(): MetricGraphConfig {
    throw new Error("This method is depricated");
  }

  public toMetricConfig(): MetricConfig {
    return {
      mathExpression: {
        expression: this.expression,
        expressionMetrics: this.expressionMetrics
      }
    };
  }

  public toString() {
    return this.label;
  }

  private getPeriod(): cdk.Duration {
    // TODO: Overall period must be the LCM of expressionMetrics periods.
    // However, if different periods are used then most probably something was misconfigured.
    let period = cdk.Duration.millis(1);
    Object.keys(this.expressionMetrics).forEach(key => {
      const metric = this.expressionMetrics[key];
      if (metric instanceof Metric || metric instanceof MathExpression) {
        if (period.toMilliseconds() < metric.period.toMilliseconds()) {
          period = metric.period;
        }
      }
    });
    return period;
  }
}

/**
 * Properties needed to make an alarm from a metric
 */
export interface CreateAlarmOptions {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(5)
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
   * @default Average
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
   * Comparison to use to check if metric is breaching
   *
   * @default GreaterThanOrEqualToThreshold
   */
  readonly comparisonOperator?: ComparisonOperator;

  /**
   * The value against which the specified statistic is compared.
   */
  readonly threshold: number;

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

function ifUndefined<T>(x: T | undefined, def: T | undefined): T | undefined {
  if (x !== undefined) {
    return x;
  }
  return def;
}
