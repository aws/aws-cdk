/**
 * Available log levels for Flink applications.
 */
export enum FlinkLogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Granularity of metrics sent to CloudWatch.
 */
export enum FlinkMetricsLevel {
  APPLICATION = 'APPLICATION',
  TASK = 'TASK',
  OPERATOR = 'OPERATOR',
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
  public static readonly FLINK_1_6 = new FlinkRuntime('FLINK-1_6');
  public static readonly FLINK_1_8 = new FlinkRuntime('FLINK-1_8');
  public static readonly FLINK_1_11 = new FlinkRuntime('FLINK-1_11');
  public constructor(public readonly value: string) {}
}
