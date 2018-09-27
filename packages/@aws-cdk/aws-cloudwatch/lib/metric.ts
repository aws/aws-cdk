import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Alarm, ComparisonOperator, TreatMissingData } from './alarm';
import { parseStatistic } from './util.statistic';

export type DimensionHash = {[dim: string]: any};

/**
 * Properties for a metric
 */
export interface MetricProps {
  /**
   * Dimensions of the metric
   *
   * @default No dimensions
   */
  dimensions?: DimensionHash;

  /**
   * Namespace of the metric.
   */
  namespace: string;

  /**
   * Name of the metric.
   */
  metricName: string;

  /**
   * The period over which the specified statistic is applied.
   *
   * Specify time in seconds, in multiples of 60.
   *
   * @default 300
   */
  periodSec?: number;

  /**
   * What function to use for aggregating.
   *
   * Can be one of the following (case insensitive)
   *
   * - "minimum" | "min"
   * - "maximum" | "max"
   * - "average" | "avg"
   * - "sum"
   * - "samplecount | "n"
   * - "pNN.NN"
   *
   * @default Average
   */
  statistic?: string;

  /**
   * Unit for the metric that is associated with the alarm
   */
  unit?: Unit;

  /**
   * Label for this metric when added to a Graph in a Dashboard
   */
  label?: string;

  /**
   * Color for this metric when added to a Graph in a Dashboard
   */
  color?: string;
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
export class Metric {
  /**
   * Grant permissions to the given identity to write metrics.
   *
   * @param identity The IAM identity to give permissions to.
   */
  public static grantPutMetricData(identity?: iam.IIdentityResource) {
    if (!identity) { return; }

    identity.addToPolicy(new cdk.PolicyStatement()
      .addAllResources()
      .addAction("cloudwatch:PutMetricData"));
  }

  public readonly dimensions?: DimensionHash;
  public readonly namespace: string;
  public readonly metricName: string;
  public readonly periodSec: number;
  public readonly statistic: string;
  public readonly unit?: Unit;
  public readonly label?: string;
  public readonly color?: string;

  constructor(props: MetricProps) {
    if (props.periodSec !== undefined
      && props.periodSec !== 1 && props.periodSec !== 5 && props.periodSec !== 10 && props.periodSec !== 30
      && props.periodSec % 60 !== 0) {
      throw new Error("'periodSec' must be 1, 5, 10, 30, or a multiple of 60");
    }

    this.dimensions = props.dimensions;
    this.namespace = props.namespace;
    this.metricName = props.metricName;
    this.periodSec = props.periodSec !== undefined ? props.periodSec : 300;
    this.statistic = props.statistic || "Average";
    this.label = props.label;
    this.color = props.color;
    this.unit = props.unit;

    // Try parsing, this will throw if it's not a valid stat
    parseStatistic(this.statistic);
  }

  /**
   * Return a copy of Metric with properties changed.
   *
   * All properties except namespace and metricName can be changed.
   *
   * @param props The set of properties to change.
   */
  public with(props: MetricCustomization): Metric {
    return new Metric({
      dimensions: ifUndefined(props.dimensions, this.dimensions),
      namespace: this.namespace,
      metricName: this.metricName,
      periodSec: ifUndefined(props.periodSec, this.periodSec),
      statistic: ifUndefined(props.statistic, this.statistic),
      unit: ifUndefined(props.unit, this.unit),
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
  public newAlarm(parent: cdk.Construct, name: string, props: NewAlarmProps): Alarm {
    return new Alarm(parent, name, {
      metric: this.with({
        statistic: props.statistic,
        periodSec: props.periodSec,
      }),
      alarmName: props.alarmName,
      alarmDescription: props.alarmDescription,
      comparisonOperator: props.comparisonOperator,
      threshold: props.threshold,
      evaluationPeriods: props.evaluationPeriods,
      evaluateLowSampleCountPercentile: props.evaluateLowSampleCountPercentile,
      treatMissingData: props.treatMissingData,
      actionsEnabled: props.actionsEnabled,
    });
  }

  /**
   * Return the dimensions of this Metric as a list of Dimension.
   */
  public dimensionsAsList(): Dimension[] {
    const dims = this.dimensions;

    if (dims === undefined) {
      return [];
    }

    const list = Object.keys(dims).map(key => ({ name: key, value: dims[key] }));

    return list;
  }
}

/**
 * Metric dimension
 */
export interface Dimension {
  /**
   * Name of the dimension
   */
  name: string;

  /**
   * Value of the dimension
   */
  value: any;
}

/**
 * Statistic to use over the aggregation period
 */
export enum Statistic {
  SampleCount = 'SampleCount',
  Average = 'Average',
  Sum = 'Sum',
  Minimum = 'Minimum',
  Maximum = 'Maximum',
}

/**
 * Unit for metric
 */
export enum Unit {
  Seconds = 'Seconds',
  Microseconds = 'Microseconds',
  Milliseconds = 'Milliseconds',
  Bytes_ = 'Bytes',
  Kilobytes = 'Kilobytes',
  Megabytes = 'Megabytes',
  Gigabytes = 'Gigabytes',
  Terabytes = 'Terabytes',
  Bits = 'Bits',
  Kilobits = 'Kilobits',
  Megabits = 'Megabits',
  Gigabits = 'Gigabits',
  Terabits = 'Terabits',
  Percent = 'Percent',
  Count = 'Count',
  BytesPerSecond = 'Bytes/Second',
  KilobytesPerSecond = 'Kilobytes/Second',
  MegabytesPerSecond = 'Megabytes/Second',
  GigabytesPerSecond = 'Gigabytes/Second',
  TerabytesPerSecond = 'Terabytes/Second',
  BitsPerSecond = 'Bits/Second',
  KilobitsPerSecond = 'Kilobits/Second',
  MegabitsPerSecond = 'Megabits/Second',
  GigabitsPerSecond = 'Gigabits/Second',
  TerabitsPerSecond = 'Terabits/Second',
  CountPerSecond = 'Count/Second',
  None = 'None'
}

/**
 * Properties of a metric that can be changed
 */
export interface MetricCustomization {
  /**
   * Dimensions of the metric
   *
   * @default No dimensions
   */
  dimensions?: DimensionHash;

  /**
   * The period over which the specified statistic is applied.
   *
   * Specify time in seconds, in multiples of 60.
   *
   * @default 300
   */
  periodSec?: number;

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
  statistic?: string;

  /**
   * Unit for the metric that is associated with the alarm
   */
  unit?: Unit;

  /**
   * Label for this metric when added to a Graph in a Dashboard
   */
  label?: string;

  /**
   * Color for this metric when added to a Graph in a Dashboard
   */
  color?: string;
}

/**
 * Properties to make an alarm from a metric
 */
export interface NewAlarmProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * Specify time in seconds, in multiples of 60.
   *
   * @default 300
   */
  periodSec?: number;

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
  statistic?: string;

  /**
   * Name of the alarm
   *
   * @default Automatically generated name
   */
  alarmName?: string;

  /**
   * Description for the alarm
   *
   * @default No description
   */
  alarmDescription?: string;

  /**
   * Comparison to use to check if metric is breaching
   *
   * @default GreaterThanOrEqualToThreshold
   */
  comparisonOperator?: ComparisonOperator;

  /**
   * The value against which the specified statistic is compared.
   */
  threshold: number;

  /**
   * The number of periods over which data is compared to the specified threshold.
   */
  evaluationPeriods: number;

  /**
   * Specifies whether to evaluate the data and potentially change the alarm state if there are too few data points to be statistically significant.
   *
   * Used only for alarms that are based on percentiles.
   */
  evaluateLowSampleCountPercentile?: string;

  /**
   * Sets how this alarm is to handle missing data points.
   *
   * @default TreatMissingData.Missing
   */
  treatMissingData?: TreatMissingData;

  /**
   * Whether the actions for this alarm are enabled
   *
   * @default true
   */
  actionsEnabled?: boolean;
}

function ifUndefined<T>(x: T | undefined, def: T | undefined): T | undefined {
  if (x !== undefined) {
    return x;
  }
  return def;
}
