/**
 * Available log levels for Flink applications.
 */
export enum LogLevel {
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
export enum MetricsLevel {
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
 *
 * @deprecated Use raw property bags instead (object literals, `Map<String,Object>`, etc... )
 */
export interface PropertyGroups {
  /**
   * This index signature is not usable in non-TypeScript/JavaScript languages.
   *
   * @jsii ignore
   */
  readonly [propertyId: string]: { [mapKey: string]: string };
}

/**
 * Available Flink runtimes for Kinesis Analytics.
 */
export class Runtime {
  /** Flink Version 1.6 */
  public static readonly FLINK_1_6 = Runtime.of('FLINK-1_6');

  /** Flink Version 1.8 */
  public static readonly FLINK_1_8 = Runtime.of('FLINK-1_8');

  /** Flink Version 1.11 */
  public static readonly FLINK_1_11 = Runtime.of('FLINK-1_11');

  /** Flink Version 1.13 */
  public static readonly FLINK_1_13 = Runtime.of('FLINK-1_13');

  /** Flink Version 1.15 */
  public static readonly FLINK_1_15 = Runtime.of('FLINK-1_15');

  /** Create a new Runtime with with an arbitrary Flink version string */
  public static of(value: string) {
    return new Runtime(value);
  }

  /** The Cfn string that represents a version of Flink */
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }
}
