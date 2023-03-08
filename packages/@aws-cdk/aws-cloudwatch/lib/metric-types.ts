import { Duration } from '@aws-cdk/core';

/**
 * Interface for metrics
 */
export interface IMetric {
  /**
   * Any warnings related to this metric
   *
   * Should be attached to the consuming construct.
   *
   * @default - None
   */
  readonly warnings?: string[];

  /**
   * Inspect the details of the metric object
   */
  toMetricConfig(): MetricConfig;

  /**
   * Turn this metric object into an alarm configuration
   *
   * @deprecated Use `toMetricConfig()` instead.
   */
  toAlarmConfig(): MetricAlarmConfig;

  /**
   * Turn this metric object into a graph configuration
   *
   * @deprecated Use `toMetricConfig()` instead.
   */
  toGraphConfig(): MetricGraphConfig;
}

/**
 * Metric dimension
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cw-dimension.html
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
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html
 * @deprecated Use one of the factory methods on `Stats` to produce statistics strings
 */
export enum Statistic {
  /**
   * The count (number) of data points used for the statistical calculation.
   */
  SAMPLE_COUNT = 'SampleCount',

  /**
   * The value of Sum / SampleCount during the specified period.
   */
  AVERAGE = 'Average',
  /**
   * All values submitted for the matching metric added together.
   * This statistic can be useful for determining the total volume of a metric.
   */
  SUM = 'Sum',
  /**
   * The lowest value observed during the specified period.
   * You can use this value to determine low volumes of activity for your application.
   */
  MINIMUM = 'Minimum',
  /**
   * The highest value observed during the specified period.
   * You can use this value to determine high volumes of activity for your application.
   */
  MAXIMUM = 'Maximum',
}

/**
 * Unit for metric
 */
export enum Unit {
  /**
   * Seconds
   */
  SECONDS = 'Seconds',

  /**
   * Microseconds
   */
  MICROSECONDS = 'Microseconds',

  /**
   * Milliseconds
   */
  MILLISECONDS = 'Milliseconds',

  /**
   * Bytes
   */
  BYTES = 'Bytes',

  /**
   * Kilobytes
   */
  KILOBYTES = 'Kilobytes',

  /**
   * Megabytes
   */
  MEGABYTES = 'Megabytes',

  /**
   * Gigabytes
   */
  GIGABYTES = 'Gigabytes',

  /**
   * Terabytes
   */
  TERABYTES = 'Terabytes',

  /**
   * Bits
   */
  BITS = 'Bits',

  /**
   * Kilobits
   */
  KILOBITS = 'Kilobits',

  /**
   * Megabits
   */
  MEGABITS = 'Megabits',

  /**
   * Gigabits
   */
  GIGABITS = 'Gigabits',

  /**
   * Terabits
   */
  TERABITS = 'Terabits',

  /**
   * Percent
   */
  PERCENT = 'Percent',

  /**
   * Count
   */
  COUNT = 'Count',

  /**
   * Bytes/second (B/s)
   */
  BYTES_PER_SECOND = 'Bytes/Second',

  /**
   * Kilobytes/second (kB/s)
   */
  KILOBYTES_PER_SECOND = 'Kilobytes/Second',

  /**
   * Megabytes/second (MB/s)
   */
  MEGABYTES_PER_SECOND = 'Megabytes/Second',

  /**
   * Gigabytes/second (GB/s)
   */
  GIGABYTES_PER_SECOND = 'Gigabytes/Second',

  /**
   * Terabytes/second (TB/s)
   */
  TERABYTES_PER_SECOND = 'Terabytes/Second',

  /**
   * Bits/second (b/s)
   */
  BITS_PER_SECOND = 'Bits/Second',

  /**
   * Kilobits/second (kb/s)
   */
  KILOBITS_PER_SECOND = 'Kilobits/Second',

  /**
   * Megabits/second (Mb/s)
   */
  MEGABITS_PER_SECOND = 'Megabits/Second',

  /**
   * Gigabits/second (Gb/s)
   */
  GIGABITS_PER_SECOND = 'Gigabits/Second',

  /**
   * Terabits/second (Tb/s)
   */
  TERABITS_PER_SECOND = 'Terabits/Second',

  /**
   * Count/second
   */
  COUNT_PER_SECOND = 'Count/Second',

  /**
   * None
   */
  NONE = 'None',
}

/**
 * Properties of a rendered metric
 */
export interface MetricConfig {
  /**
   * In case the metric represents a query, the details of the query
   *
   * @default - None
   */
  readonly metricStat?: MetricStatConfig;

  /**
   * In case the metric is a math expression, the details of the math expression
   *
   * @default - None
   */
  readonly mathExpression?: MetricExpressionConfig;

  /**
   * Additional properties which will be rendered if the metric is used in a dashboard
   *
   * Examples are 'label' and 'color', but any key in here will be
   * added to dashboard graphs.
   *
   * @default - None
   */
  readonly renderingProperties?: Record<string, unknown>;
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
   * This field has been renamed from plain `unit` to clearly communicate
   * its purpose.
   *
   * @default - Refer to all metric datums
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

  /**
   * How many seconds to aggregate over
   */
  readonly period: number;

  /**
   * Account to evaluate search expressions within.
   *
   * @default - Deployment account.
   */
  readonly searchAccount?: string;

  /**
   * Region to evaluate search expressions within.
   *
   * @default - Deployment region.
   */
  readonly searchRegion?: string;
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
 * @deprecated Replaced by MetricConfig.
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
   * The hex color code, prefixed with '#' (e.g. '#00ff00'), to use when this metric is rendered on a graph.
   * The `Color` class has a set of standard colors that can be used here.
   */
  readonly color?: string;

  /**
   * Aggregation function to use (can be either simple or a percentile)
   */
  readonly stat?: string;
}
