// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class TimestreamMetrics {
  public static userErrorsSum(dimensions: { Operation: string }): MetricWithDims<{ Operation: string }>;
  public static userErrorsSum(dimensions: { DatabaseName: string, Operation: string, TableName: string }): MetricWithDims<{ DatabaseName: string, Operation: string, TableName: string }>;
  public static userErrorsSum(dimensions: any) {
    return {
      namespace: 'AWS/Timestream',
      metricName: 'UserErrors',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static systemErrorsSum(dimensions: { Operation: string }): MetricWithDims<{ Operation: string }>;
  public static systemErrorsSum(dimensions: { DatabaseName: string, Operation: string, TableName: string }): MetricWithDims<{ DatabaseName: string, Operation: string, TableName: string }>;
  public static systemErrorsSum(dimensions: any) {
    return {
      namespace: 'AWS/Timestream',
      metricName: 'SystemErrors',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static successfulRequestLatencySampleCount(dimensions: { Operation: string }): MetricWithDims<{ Operation: string }>;
  public static successfulRequestLatencySampleCount(dimensions: { DatabaseName: string, Operation: string, TableName: string }): MetricWithDims<{ DatabaseName: string, Operation: string, TableName: string }>;
  public static successfulRequestLatencySampleCount(dimensions: any) {
    return {
      namespace: 'AWS/Timestream',
      metricName: 'SuccessfulRequestLatency',
      dimensionsMap: dimensions,
      statistic: 'SampleCount',
    };
  }
}
type MetricWithDims<D> = { namespace: string, metricName: string, statistic: string, dimensionsMap: D };
