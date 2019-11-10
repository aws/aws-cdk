import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { ComparisonOperator, TreatMissingData } from './alarm';
import { CfnAlarm } from './cloudwatch.generated';
import { Dimension, IMetric, MetricAlarmConfig, MetricRenderingProperties, Unit } from './metric-types';
import { AlarmTimeSeriesProps, MetricJson, TimeSeriesJson, ToJsonProps } from './timeseries';
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

  /**
   * TODO
   * @default todo
   */
  readonly id?: string;
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
}

/**
 * Properties of a metric that can be changed
 */
export interface MetricOptions extends CommonMetricOptions {
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
  /**
   * TODO
   */
  public readonly id: string;

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
    this.id = props.id || this.metricName.toLowerCase();
  }

  public toAlarmTimeSeries(props: AlarmTimeSeriesProps = {}): CfnAlarm.MetricDataQueryProperty {
    return {
      metricStat: {
        metric: {
          dimensions: this.dimensionsAsList(),
          metricName: this.metricName,
          namespace: this.namespace,
        },
        period: this.period.toSeconds(),
        stat: this.statistic,
        unit: this.unit
      },
      id: this.id,
      returnData: props.returnData
    };
  }

  public toJson(props: ToJsonProps = {}): TimeSeriesJson {
    const dimensions: any[] = this.dimensionsAsList().map(d => [d.name, d.value]);
    const dims = [].concat(...dimensions);

    const renderingProperties: MetricRenderingProperties = {
      color: this.color,
      label: this.label,
      period: this.period.toSeconds(),
      stat: this.statistic,
      visible: props.visible,
      yAxis: props.yAxis || "left",
      id: this.id
    };

    // Todo: refactor
    const array: MetricJson = [
      this.namespace,
      this.metricName,
      ...dims,
      // renderingProperties
    ];
    array.push(renderingProperties);

    return array;
  }

  public toAlarmConfig(): MetricAlarmConfig {
    const stat = parseStatistic(this.statistic);
    const dims = this.dimensionsAsList();

    return {
      dimensions: dims.length > 0 ? dims : undefined,
      namespace: this.namespace,
      metricName: this.metricName,
      period: this.period.toSeconds(),
      statistic: stat.type === 'simple' ? stat.statistic : undefined,
      extendedStatistic: stat.type === 'percentile' ? 'p' + stat.percentile : undefined,
      unit: this.unit
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

    return Object.keys(dims).map(key => ({ name: key, value: dims[key] }));
  }
}

/**
 * TODO
 */
export interface BaseAlarmProps {
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
   * Sets how this alarm is to handle missing data points.
   *
   * @default TreatMissingData.Missing
   */
  readonly treatMissingData?: TreatMissingData;

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
 * Properties needed to make an alarm from a metric
 */
export interface CreateAlarmOptions extends BaseAlarmProps {
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
}
