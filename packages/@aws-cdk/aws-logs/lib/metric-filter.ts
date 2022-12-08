import { Metric, MetricOptions } from '@aws-cdk/aws-cloudwatch';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ILogGroup, MetricFilterOptions } from './log-group';
import { CfnMetricFilter } from './logs.generated';

/**
 * Properties for a MetricFilter
 */
export interface MetricFilterProps extends MetricFilterOptions {
  /**
   * The log group to create the filter on.
   */
  readonly logGroup: ILogGroup;
}

/**
 * Enum values for a MetricUnit
 */
export enum MetricUnit {
  /**
   * Bits
   */
  BITS = 'Bits',

  /**
   * Bits per second
   */
  BITS_PER_SECOND = 'Bits/Second',

  /**
   * Bytes
   */
  BYTES = 'Bytes',

  /**
   * Bytes per second
   */
  BYTES_PER_SECOND = 'Bytes/Second',

  /**
   * Count
   */
  COUNT = 'Count',

  /**
   * Count per second
   */
  COUNT_PER_SECOND = 'Count/Second',

  /**
   * Gigabits
   */
  GIGABITS = 'Gigabits',

  /**
   * Gigabits per second
   */
  GIGABITS_PER_SECOND = 'Gigabits/Second',

  /**
   * Gigabytes
   */
  GIGABYTES = 'Gigabytes',

  /**
   * Gigabytes per second
   */
  GIGABYTES_PER_SECOND = 'Gigabytes/Second',

  /**
   * Kilobits
   */
  KILOBITS = 'Kilobits',

  /**
   * Kilobits per second
   */
  KILOBITS_PER_SECOND = 'Kilobits/Second',

  /**
   * Kilobytes
   */
  KILOBYTES = 'Kilobytes',

  /**
   * Kilobytes per second
   */
  KILOBYTES_PER_SECOND = 'Kilobytes/Second',

  /**
   * Megabits
   */
  MEGABITS = 'Megabits',

  /**
   * Megabits per second
   */
  MEGABITS_PER_SECOND = 'Megabits/Second',

  /**
   * Megabytes
   */
  MEGABYTES = 'Megabytes',

  /**
   * Megabytes per second
   */
  MEGYTES_PER_SECOND = 'Megabytes/Second',

  /**
   * Microseconds
   */
  MICROSECONDS = 'Microseconds',

  /**
   * Milliseconds
   */
  MILLISECONDS = 'Milliseconds',

  /**
   * None
   */
  NONE = 'None',

  /**
   * Percent
   */
  PERCENT = 'Percent',

  /**
   * Seconds
   */
  SECONDS = 'Seconds',

  /**
   * Terabits
   */
  TERABITS = 'Terabits',

  /**
   * Terabits per second
   */
  TERABITS_PER_SECOND = 'Terabits/Second',

  /**
   * Terabytes
   */
  TERABYTES = 'Terabytes',

  /**
   * Terabytes per second
   */
  TERABYTES_PER_SECOND = 'Terabytes/Second',
}

/**
 * A filter that extracts information from CloudWatch Logs and emits to CloudWatch Metrics
 */
export class MetricFilter extends Resource {

  private readonly metricName: string;
  private readonly metricNamespace: string;

  constructor(scope: Construct, id: string, props: MetricFilterProps) {
    super(scope, id);

    this.metricName = props.metricName;
    this.metricNamespace = props.metricNamespace;

    if (Object.keys(props.dimensions ?? {}).length > 3) {
      throw new Error('MetricFilter only supports a maximum of 3 Dimensions');
    }

    // It looks odd to map this object to a singleton list, but that's how
    // we're supposed to do it according to the docs.
    //
    // > Currently, you can specify only one metric transformation for
    // > each metric filter. If you want to specify multiple metric
    // > transformations, you must specify multiple metric filters.
    //
    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-metricfilter.html
    new CfnMetricFilter(this, 'Resource', {
      logGroupName: props.logGroup.logGroupName,
      filterPattern: props.filterPattern.logPatternString,
      metricTransformations: [{
        metricNamespace: props.metricNamespace,
        metricName: props.metricName,
        metricValue: props.metricValue ?? '1',
        defaultValue: props.defaultValue,
        dimensions: props.dimensions ? Object.entries(props.dimensions).map(([key, value]) => ({ key, value })) : undefined,
        unit: props.unit ?? undefined,
      }],
    });
  }

  /**
   * Return the given named metric for this Metric Filter
   *
   * @default avg over 5 minutes
   */
  public metric(props?: MetricOptions): Metric {
    return new Metric({
      metricName: this.metricName,
      namespace: this.metricNamespace,
      statistic: 'avg',
      ...props,
    }).attachTo(this);
  }
}
