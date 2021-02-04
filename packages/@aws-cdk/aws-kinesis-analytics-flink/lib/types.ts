/**
 * Available log levels for Flink applications.
 */
export enum FlinkLogLevel {
  /** Debug level logging */
  DEBUG = 'DEBUG',

  /** Info level logging */
  INFO = 'INFO',

  /** Warn level logging */
  WARN = 'WARN',

  /** Error level logging */
  ERROR = 'ERROR',
}

/**
 * Granularity of metrics sent to CloudWatch.
 */
export enum FlinkMetricsLevel {
  /** Application sends the least metrics to CloudWatch */
  APPLICATION = 'APPLICATION',

  /** Task includes task-level metrics sent to CloudWatch */
  TASK = 'TASK',

  /** Operator includes task-level and operator-level metrics sent to CloudWatch */
  OPERATOR = 'OPERATOR',

  /** Send all metrics including metrics per task thread */
  PARALLELISM = 'PARALLELISM',
}

/**
 * Interface for building AWS::KinesisAnalyticsV2::Application PropertyGroup
 * configuration.
 */
export interface PropertyGroups {
  readonly [propertyId: string]: {[mapKey: string]: string};
}

/**
 * Available Flink runtimes for Kinesis Analytics.
 *
 * @example
 * // Creating a new runtime that isn't in CDK yet.
 * const runtime = new FlinkRuntime(FLINK-9_99);
 */
export class FlinkRuntime {
  /** Flink Version 1.6 */
  public static readonly FLINK_1_6 = new FlinkRuntime('FLINK-1_6');

  /** Flink Version 1.8 */
  public static readonly FLINK_1_8 = new FlinkRuntime('FLINK-1_8');

  /** Flink Version 1.11 */
  public static readonly FLINK_1_11 = new FlinkRuntime('FLINK-1_11');

  /** The Cfn string that represents a version of Flink */
  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }
}
