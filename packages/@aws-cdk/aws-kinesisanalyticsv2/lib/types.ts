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
