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
