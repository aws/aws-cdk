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

  /**
   * Percentile (p) indicates the relative standing of a value in a dataset.
   * Percentiles help you get a better understanding of the distribution of your metric data.
   *
   * p10 is the 10th percentile and means that 10% of the data within the period is lower than this value and 90% of the data is higher than this value.
   */
  P10 = 'p10',
  /**
   * Percentile (p) indicates the relative standing of a value in a dataset.
   * Percentiles help you get a better understanding of the distribution of your metric data.
   *
   * p50 is the 50th percentile and means that 50% of the data within the period is lower than this value and 50% of the data is higher than this value.
   */
  P50 = 'p50',
  /**
   * Percentile (p) indicates the relative standing of a value in a dataset.
   * Percentiles help you get a better understanding of the distribution of your metric data.
   *
   * p90 is the 90th percentile and means that 90% of the data within the period is lower than this value and 10% of the data is higher than this value.
   */
  P90 = 'p90',
  /**
   * Percentile (p) indicates the relative standing of a value in a dataset.
   * Percentiles help you get a better understanding of the distribution of your metric data.
   *
   * p95 is the 95th percentile and means that 95% of the data within the period is lower than this value and 5% of the data is higher than this value.
   */
  P95 = 'p95',
  /**
   * Percentile (p) indicates the relative standing of a value in a dataset.
   * Percentiles help you get a better understanding of the distribution of your metric data.
   *
   * p99 is the 99th percentile and means that 99% of the data within the period is lower than this value and 1% of the data is higher than this value.
   */
  P99 = 'p99',
  /**
   * Percentile (p) indicates the relative standing of a value in a dataset.
   * Percentiles help you get a better understanding of the distribution of your metric data.
   *
   * p99.9 is the 99.9th percentile and means that 99.9% of the data within the period is lower than this value and 0.1% of the data is higher than this value.
   */
  P99_9 = 'p99.9',
  /**
   * Percentile (p) indicates the relative standing of a value in a dataset.
   * Percentiles help you get a better understanding of the distribution of your metric data.
   *
   * p99.99 is the 99.99th percentile and means that 99.9% of the data within the period is lower than this value and 0.01% of the data is higher than this value.
   */
  P99_99 = 'p99.99',

  /**
   * Trimmed mean (TM) is the mean of all values that are between two specified boundaries. Values outside of the boundaries are ignored when the mean is calculated.
   * You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places. The numbers can be absolute values or percentages.
   *
   * tm10 calculates the average after removing the 90% of data points with the highest values.
   */
  TM10 = 'tm10',
  /**
   * Trimmed mean (TM) is the mean of all values that are between two specified boundaries. Values outside of the boundaries are ignored when the mean is calculated.
   * You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places. The numbers can be absolute values or percentages.
   *
   * tm50 calculates the average after removing the 50% of data points with the highest values.
   */
  TM50 = 'tm50',
  /**
   * Trimmed mean (TM) is the mean of all values that are between two specified boundaries. Values outside of the boundaries are ignored when the mean is calculated.
   * You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places. The numbers can be absolute values or percentages.
   *
   * tm90 calculates the average after removing the 10% of data points with the highest values.
   */
  TM90 = 'tm90',
  /**
   * Trimmed mean (TM) is the mean of all values that are between two specified boundaries. Values outside of the boundaries are ignored when the mean is calculated.
   * You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places. The numbers can be absolute values or percentages.
   *
   * tm95 calculates the average after removing the 5% of data points with the highest values.
   */
  TM95 = 'tm95',
  /**
   * Trimmed mean (TM) is the mean of all values that are between two specified boundaries. Values outside of the boundaries are ignored when the mean is calculated.
   * You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places. The numbers can be absolute values or percentages.
   *
   * tm99 calculates the average after removing the 1% of data points with the highest values.
   */
  TM99 = 'tm99',
  /**
   * Trimmed mean (TM) is the mean of all values that are between two specified boundaries. Values outside of the boundaries are ignored when the mean is calculated.
   * You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places. The numbers can be absolute values or percentages.
   *
   * tm99.9 calculates the average after removing the 0.1% of data points with the highest values.
   */
  TM99_9 = 'tm99.9',
  /**
   * Trimmed mean (TM) is the mean of all values that are between two specified boundaries. Values outside of the boundaries are ignored when the mean is calculated.
   * You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places. The numbers can be absolute values or percentages.
   *
   * tm99 calculates the average after removing the 0.01% of data points with the highest values.
   */
  TM99_99 = 'tm99.99',

  /**
   * Trimmed mean (TM) is the mean of all values that are between two specified boundaries. Values outside of the boundaries are ignored when the mean is calculated.
   * You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places. The numbers can be absolute values or percentages.
   *
   * TM(1%:99%) calculates the average after removing the 1% lowest data points and the 1% highest data points.
   */
  TM_1P_99P = 'TM(1%:99%)',
  /**
   * Trimmed mean (TM) is the mean of all values that are between two specified boundaries. Values outside of the boundaries are ignored when the mean is calculated.
   * You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places. The numbers can be absolute values or percentages.
   *
   * TM(2%:98%) calculates the average after removing the 2% lowest data points and the 2% highest data points.
   */
  TM_2P_98P = 'TM(2%:98%)',
  /**
   * Trimmed mean (TM) is the mean of all values that are between two specified boundaries. Values outside of the boundaries are ignored when the mean is calculated.
   * You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places. The numbers can be absolute values or percentages.
   *
   * TM(5%:95%) calculates the average after removing the 5% lowest data points and the 5% highest data points.
   */
  TM_5P_95P = 'TM(5%:95%)',
  /**
   * Trimmed mean (TM) is the mean of all values that are between two specified boundaries. Values outside of the boundaries are ignored when the mean is calculated.
   * You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places. The numbers can be absolute values or percentages.
   *
   * TM(10%:90%) calculates the average after removing the 10% lowest data points and the 10% highest data points.
   */
  TM_10P_90P = 'TM(10%:90%)',

  /**
   * Interquartile mean (IQM) is the trimmed mean of the interquartile range, or the middle 50% of values. It is equivalent to TM(25%:75%).
   */
  IQM = 'IQM',

  /**
   * Winsorized mean (WM) is similar to trimmed mean. However, with winsorized mean, the values that are outside the boundary are not ignored,
   * but instead are considered to be equal to the value at the edge of the appropriate boundary.
   * After this normalization, the average is calculated. You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places.
   *
   * wm10 calculates the average while treating the 90% of the highest values to be equal to the value at the 10th percentile.
   */
  wm10 = 'wm10',
  /**
   * Winsorized mean (WM) is similar to trimmed mean. However, with winsorized mean, the values that are outside the boundary are not ignored,
   * but instead are considered to be equal to the value at the edge of the appropriate boundary.
   * After this normalization, the average is calculated. You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places.
   *
   * wm50 calculates the average while treating the 50% of the highest values to be equal to the value at the 50th percentile.
   */
  wm50 = 'wm50',
  /**
   * Winsorized mean (WM) is similar to trimmed mean. However, with winsorized mean, the values that are outside the boundary are not ignored,
   * but instead are considered to be equal to the value at the edge of the appropriate boundary.
   * After this normalization, the average is calculated. You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places.
   *
   * wm90 calculates the average while treating the 10% of the highest values to be equal to the value at the 90th percentile.
   */
  wm90 = 'wm90',
  /**
   * Winsorized mean (WM) is similar to trimmed mean. However, with winsorized mean, the values that are outside the boundary are not ignored,
   * but instead are considered to be equal to the value at the edge of the appropriate boundary.
   * After this normalization, the average is calculated. You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places.
   *
   * wm95 calculates the average while treating the 5% of the highest values to be equal to the value at the 95th percentile.
   */
  wm95 = 'wm95',
  /**
   * Winsorized mean (WM) is similar to trimmed mean. However, with winsorized mean, the values that are outside the boundary are not ignored,
   * but instead are considered to be equal to the value at the edge of the appropriate boundary.
   * After this normalization, the average is calculated. You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places.
   *
   * wm99 calculates the average while treating the 1% of the highest values to be equal to the value at the 99th percentile.
   */
  wm99 = 'wm99',
  /**
   * Winsorized mean (WM) is similar to trimmed mean. However, with winsorized mean, the values that are outside the boundary are not ignored,
   * but instead are considered to be equal to the value at the edge of the appropriate boundary.
   * After this normalization, the average is calculated. You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places.
   *
   * wm99.9 calculates the average while treating the 0.1% of the highest values to be equal to the value at the 99.9th percentile.
   */
  wm99_9 = 'wm99.9',
  /**
   * Winsorized mean (WM) is similar to trimmed mean. However, with winsorized mean, the values that are outside the boundary are not ignored,
   * but instead are considered to be equal to the value at the edge of the appropriate boundary.
   * After this normalization, the average is calculated. You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places.
   *
   * wm99.99 calculates the average while treating the 0.01% of the highest values to be equal to the value at the 99.99th percentile.
   */
  wm99_99 = 'wm99.99',

  /**
   * Winsorized mean (WM) is similar to trimmed mean. However, with winsorized mean, the values that are outside the boundary are not ignored,
   * but instead are considered to be equal to the value at the edge of the appropriate boundary.
   * After this normalization, the average is calculated. You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places.
   *
   * WM(1%:99%) calculates the average while treating the highest 1% of data points to be the value of the 99% boundary,
   * and treating the lowest 1% of data points to be the value of the 1% boundary.
   */
  WM_1P_99P = 'WM(1%:99%)',
  /**
   * Winsorized mean (WM) is similar to trimmed mean. However, with winsorized mean, the values that are outside the boundary are not ignored,
   * but instead are considered to be equal to the value at the edge of the appropriate boundary.
   * After this normalization, the average is calculated. You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places.
   *
   * WM(2%:98%) calculates the average while treating the highest 2% of data points to be the value of the 98% boundary,
   * and treating the lowest 2% of data points to be the value of the 2% boundary.
   */
  WM_2P_98P = 'WM(2%:98%)',
  /**
   * Winsorized mean (WM) is similar to trimmed mean. However, with winsorized mean, the values that are outside the boundary are not ignored,
   * but instead are considered to be equal to the value at the edge of the appropriate boundary.
   * After this normalization, the average is calculated. You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places.
   *
   * WM(5%:95%) calculates the average while treating the highest 5% of data points to be the value of the 95% boundary,
   * and treating the lowest 5% of data points to be the value of the 5% boundary.
   */
  WM_5P_95P = 'WM(5%:95%)',
  /**
   * Winsorized mean (WM) is similar to trimmed mean. However, with winsorized mean, the values that are outside the boundary are not ignored,
   * but instead are considered to be equal to the value at the edge of the appropriate boundary.
   * After this normalization, the average is calculated. You define the boundaries as one or two numbers between 0 and 100, up to 10 decimal places.
   *
   * WM(10%:90%) calculates the average while treating the highest 10% of data points to be the value of the 90% boundary,
   * and treating the lowest 10% of data points to be the value of the 10% boundary.
   */
  WM_10P_90P = 'WM(10%:90%)',

  /**
   * Trimmed count (TC) is the number of data points in the chosen range for a trimmed mean statistic.
   *
   * tc10 returns the number of data points not including any data points that fall in the highest 90% of the values.
   */
  TC10 = 'tc10',
  /**
   * Trimmed count (TC) is the number of data points in the chosen range for a trimmed mean statistic.
   *
   * tc50 returns the number of data points not including any data points that fall in the highest 50% of the values.
   */
  TC50 = 'tc50',
  /**
   * Trimmed count (TC) is the number of data points in the chosen range for a trimmed mean statistic.
   *
   * tc90 returns the number of data points not including any data points that fall in the highest 10% of the values.
   */
  TC90 = 'tc90',
  /**
   * Trimmed count (TC) is the number of data points in the chosen range for a trimmed mean statistic.
   *
   * tc95 returns the number of data points not including any data points that fall in the highest 5% of the values.
   */
  TC95 = 'tc95',
  /**
   * Trimmed count (TC) is the number of data points in the chosen range for a trimmed mean statistic.
   *
   * tc99 returns the number of data points not including any data points that fall in the highest 1% of the values.
   */
  TC99 = 'tc99',
  /**
   * Trimmed count (TC) is the number of data points in the chosen range for a trimmed mean statistic.
   *
   * tc99.9 returns the number of data points not including any data points that fall in the highest 0.1% of the values.
   */
  TC99_9 = 'tc99.9',
  /**
   * Trimmed count (TC) is the number of data points in the chosen range for a trimmed mean statistic.
   *
   * tc99.99 returns the number of data points not including any data points that fall in the highest 0.01% of the values.
   */
  TC99_99 = 'tc99.99',

  /**
   * Trimmed count (TC) is the number of data points in the chosen range for a trimmed mean statistic.
   *
   * TC(1%:99%) returns the number of data points not including any data points that fall in the lowest 1% of the values and the highest 99% of the values.
   */
  TC_1P_99P = 'TC(1%:99%)',
  /**
   * Trimmed count (TC) is the number of data points in the chosen range for a trimmed mean statistic.
   *
   * TC(2%:98%) returns the number of data points not including any data points that fall in the lowest 2% of the values and the highest 98% of the values.
   */
  TC_2P_98P = 'TC(2%:98%)',
  /**
   * Trimmed count (TC) is the number of data points in the chosen range for a trimmed mean statistic.
   *
   * TC(5%:95%) returns the number of data points not including any data points that fall in the lowest 5% of the values and the highest 95% of the values.
   */
  TC_5P_95P = 'TC(5%:95%)',
  /**
   * Trimmed count (TC) is the number of data points in the chosen range for a trimmed mean statistic.
   *
   * TC(10%:90%) returns the number of data points not including any data points that fall in the lowest 10% of the values and the highest 90% of the values.
   */
  TC_10P_90P = 'TC(10%:90%)',

  /**
   * Trimmed sum (TS) is the sum of the values of data points in a chosen range for a trimmed mean statistic.
   * It is equivalent to `(Trimmed Mean) * (Trimmed count)`.
   *
   * ts10 returns the sum of the data points not including any data points that fall in the highest 90% of the values.
   */
  TS10 = 'ts10',
  /**
   * Trimmed sum (TS) is the sum of the values of data points in a chosen range for a trimmed mean statistic.
   * It is equivalent to `(Trimmed Mean) * (Trimmed count)`.
   *
   * ts50 returns the sum of the data points not including any data points that fall in the highest 50% of the values.
   */
  TS50 = 'ts50',
  /**
   * Trimmed sum (TS) is the sum of the values of data points in a chosen range for a trimmed mean statistic.
   * It is equivalent to `(Trimmed Mean) * (Trimmed count)`.
   *
   * ts90 returns the sum of the data points not including any data points that fall in the highest 10% of the values.
   */
  TS90 = 'ts90',
  /**
   * Trimmed sum (TS) is the sum of the values of data points in a chosen range for a trimmed mean statistic.
   * It is equivalent to `(Trimmed Mean) * (Trimmed count)`.
   *
   * ts95 returns the sum of the data points not including any data points that fall in the highest 5% of the values.
   */
  TS95 = 'ts95',
  /**
   * Trimmed sum (TS) is the sum of the values of data points in a chosen range for a trimmed mean statistic.
   * It is equivalent to `(Trimmed Mean) * (Trimmed count)`.
   *
   * ts99 returns the sum of the data points not including any data points that fall in the highest 1% of the values.
   */
  TS99 = 'ts99',
  /**
   * Trimmed sum (TS) is the sum of the values of data points in a chosen range for a trimmed mean statistic.
   * It is equivalent to `(Trimmed Mean) * (Trimmed count)`.
   *
   * ts99.9 returns the sum of the data points not including any data points that fall in the highest 0.1% of the values.
   */
  TS99_9 = 'ts99.9',
  /**
   * Trimmed sum (TS) is the sum of the values of data points in a chosen range for a trimmed mean statistic.
   * It is equivalent to `(Trimmed Mean) * (Trimmed count)`.
   *
   * ts99.99 returns the sum of the data points not including any data points that fall in the highest 0.01% of the values.
   */
  TS99_99 = 'ts99.99',

  /**
   * Trimmed sum (TS) is the sum of the values of data points in a chosen range for a trimmed mean statistic.
   * It is equivalent to `(Trimmed Mean) * (Trimmed count)`.
   *
   * TS(1%:99%) returns the sum of the data points not including any data points that fall in the lowest 1% of the values and the highest 99% of the values.
   */
  TS_1P_99P = 'TS(1%:99%)',
  /**
   * Trimmed sum (TS) is the sum of the values of data points in a chosen range for a trimmed mean statistic.
   * It is equivalent to `(Trimmed Mean) * (Trimmed count)`.
   *
   * TS(2%:98%) returns the sum of the data points not including any data points that fall in the lowest 2% of the values and the highest 98% of the values.
   */
  TS_2P_98P = 'TS(2%:98%)',
  /**
   * Trimmed sum (TS) is the sum of the values of data points in a chosen range for a trimmed mean statistic.
   * It is equivalent to `(Trimmed Mean) * (Trimmed count)`.
   *
   * TS(5%:95%) returns the sum of the data points not including any data points that fall in the lowest 5% of the values and the highest 95% of the values.
   */
  TS_5P_95P = 'TS(5%:95%)',
  /**
   * Trimmed sum (TS) is the sum of the values of data points in a chosen range for a trimmed mean statistic.
   * It is equivalent to `(Trimmed Mean) * (Trimmed count)`.
   *
   * TS(10%:90%) returns the sum of the data points not including any data points that fall in the lowest 10% of the values and the highest 90% of the values.
   */
  TS_10P_90P = 'TS(10%:90%)'
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
  NONE = 'None'
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
