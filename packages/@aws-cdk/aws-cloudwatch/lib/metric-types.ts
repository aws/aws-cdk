/**
 * Interface for metrics
 */
export interface IMetric {
  /**
   * Turn this metric object into an alarm configuration
   */
  toAlarmConfig(): MetricAlarmConfig;

  /**
   * Turn this metric object into a graph configuration
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
 * Properties used to construct the Metric identifying part of an Alarm
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
