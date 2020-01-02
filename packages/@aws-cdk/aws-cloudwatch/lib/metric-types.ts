import { Duration } from "@aws-cdk/core";

/**
 * Interface for metrics
 */
export interface IMetric {
  /**
   * Inspect the details of the metric object
   */
  toMetricConfig(): MetricConfig;

  /**
   * Turn this metric object into an alarm configuration
   *
   * @deprecated Use `toMetricsConfig()` instead.
   */
  toAlarmConfig(): MetricAlarmConfig;

  /**
   * Turn this metric object into a graph configuration
   *
   * @deprecated Use `toMetricsConfig()` instead.
   */
  toGraphConfig(): MetricGraphConfig;
}

/**
 * Metric dimension
 *
 */
export interface Dimension {
  /**
   * Name of the dimension
   */
  readonly name: string;

  /**
   * Value of the dimension
   */
  readonly value: any;
}

/**
 * Statistic to use over the aggregation period
 */
export enum Statistic {
  SAMPLE_COUNT = "SampleCount",
  AVERAGE = "Average",
  SUM = "Sum",
  MINIMUM = "Minimum",
  MAXIMUM = "Maximum"
}

/**
 * Unit for metric
 */
export enum Unit {
  SECONDS = "Seconds",
  MICROSECONDS = "Microseconds",
  MILLISECONDS = "Milliseconds",
  BYTES = "Bytes",
  KILOBYTES = "Kilobytes",
  MEGABYTES = "Megabytes",
  GIGABYTES = "Gigabytes",
  TERABYTES = "Terabytes",
  BITS = "Bits",
  KILOBITS = "Kilobits",
  MEGABITS = "Megabits",
  GIGABITS = "Gigabits",
  TERABITS = "Terabits",
  PERCENT = "Percent",
  COUNT = "Count",
  BYTES_PER_SECOND = "Bytes/Second",
  KILOBYTES_PER_SECOND = "Kilobytes/Second",
  MEGABYTES_PER_SECOND = "Megabytes/Second",
  GIGABYTES_PER_SECOND = "Gigabytes/Second",
  TERABYTES_PER_SECOND = "Terabytes/Second",
  BITS_PER_SECOND = "Bits/Second",
  KILOBITS_PER_SECOND = "Kilobits/Second",
  MEGABITS_PER_SECOND = "Megabits/Second",
  GIGABITS_PER_SECOND = "Gigabits/Second",
  TERABITS_PER_SECOND = "Terabits/Second",
  COUNT_PER_SECOND = "Count/Second",
  NONE = "None"
}

/**
 * Properties of a rendered metric
 */
export interface MetricConfig {
  /**
   * In case the metric represents a query, the details of the query
   *
   * @default unset
   */
  readonly metricStat?: MetricStatConfig;

  /**
   * In case the metric is a math expression, the details of the math expression
   *
   * @default unset
   */
  readonly mathExpression?: MetricExpressionConfig;

  /**
   * Additional properties which will be rendered if the metric is used in a dashboard
   *
   * Examples are 'label' and 'color', but any key in here will be
   * added to dashboard graphs.
   *
   * @default {}
   */
  readonly renderingProperties?: Record<string, any>;
}

/**
 * Properties for a concrete metric
 *
 * NOTE: `unit` is no longer on this object since it is only used for `Alarms`, and doesn't mean what one
 * would expect it to mean there anyway. It is most likely to be misused.
 */
export interface MetricStatConfig {
  /**
   * The dimensions to apply to the alarm
   *
   * @default []
   */
  readonly dimensions?: Dimension[];

  /**
   * Namespace of the metric
   */
  readonly namespace: string;

  /**
   * Name of the metric
   */
  readonly metricName: string;

  /**
   * How many seconds to aggregate over
   */
  readonly period: Duration;

  /**
   * Aggregation function to use (can be either simple or a percentile)
   */
  readonly statistic: string;

  /**
   * Unit used to filter the metric stream
   *
   * Only refer to datums emitted to the metric stream with the given unit and
   * ignore all others. Only useful when datums are being emitted to the same
   * metric stream under different units.
   *
   * @default Refer to all metric datums
   */
  readonly unitFilter?: Unit;

  /**
   * Region which this metric comes from.
   *
   * @default Deployment region.
   */
  readonly region?: string;

  /**
   * Account which this metric comes from.
   *
   * @default Deployment account.
   */
  readonly account?: string;
}

/**
 * Properties for a concrete metric
 */
export interface MetricExpressionConfig {
  /**
   * Math expression for the metric.
   */
  readonly expression: string;

  /**
   * Metrics used in the math expression
   */
  readonly usingMetrics: Record<string, IMetric>;
}

/**
 * Properties used to construct the Metric identifying part of an Alarm
 *
 * @deprecated Replaced by MetricConfig
 */
export interface MetricAlarmConfig {
  /**
   * The dimensions to apply to the alarm
   */
  readonly dimensions?: Dimension[];

  /**
   * Namespace of the metric
   */
  readonly namespace: string;

  /**
   * Name of the metric
   */
  readonly metricName: string;

  /**
   * How many seconds to aggregate over
   */
  readonly period: number;

  /**
   * Simple aggregation function to use
   */
  readonly statistic?: Statistic;

  /**
   * Percentile aggregation function to use
   */
  readonly extendedStatistic?: string;

  /**
   * The unit of the alarm
   */
  readonly unit?: Unit;
}

/**
 * Properties used to construct the Metric identifying part of a Graph
 *
 * @deprecated Replaced by MetricConfig
 */
export interface MetricGraphConfig {
  /**
   * The dimensions to apply to the alarm
   */
  readonly dimensions?: Dimension[];

  /**
   * Namespace of the metric
   */
  readonly namespace: string;

  /**
   * Name of the metric
   */
  readonly metricName: string;

  /**
   * Rendering properties override yAxis parameter of the widget object
   */
  readonly renderingProperties: MetricRenderingProperties;

  /**
   * How many seconds to aggregate over
   *
   * @deprecated Use `period` in `renderingProperties`
   */
  readonly period: number;

  /**
   * Label for the metric
   *
   * @deprecated Use `label` in `renderingProperties`
   */
  readonly label?: string;

  /**
   * Color for the graph line
   *
   * @deprecated Use `color` in `renderingProperties`
   */
  readonly color?: string;

  /**
   * Aggregation function to use (can be either simple or a percentile)
   *
   * @deprecated Use `stat` in `renderingProperties`
   */
  readonly statistic?: string;

  /**
   * The unit of the alarm
   *
   * @deprecated not used in dashboard widgets
   */
  readonly unit?: Unit;
}

/**
 * Custom rendering properties that override the default rendering properties specified in the yAxis parameter of the widget object.
 *
 * @deprecated Replaced by `MetricConfig`.
 */
export interface MetricRenderingProperties {
  /**
   * How many seconds to aggregate over
   */
  readonly period: number;

  /**
   * Label for the metric
   */
  readonly label?: string;

  /**
   * Color for the graph line
   */
  readonly color?: string;

  /**
   * Aggregation function to use (can be either simple or a percentile)
   */
  readonly stat?: string;
}
