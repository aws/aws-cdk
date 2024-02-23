/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class TimestreamMetrics {
  public static userErrorsSum(dimensions: { Operation: string; DatabaseName: string; TableName: string; }): MetricWithDims<{ Operation: string; DatabaseName: string; TableName: string; }>;

  public static userErrorsSum(dimensions: { Operation: string; DatabaseName: string; TableName: string; }): MetricWithDims<{ Operation: string; DatabaseName: string; TableName: string; }>;

  public static userErrorsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Timestream",
      "metricName": "UserErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static systemErrorsSum(dimensions: { Operation: string; DatabaseName: string; TableName: string; }): MetricWithDims<{ Operation: string; DatabaseName: string; TableName: string; }>;

  public static systemErrorsSum(dimensions: { Operation: string; DatabaseName: string; TableName: string; }): MetricWithDims<{ Operation: string; DatabaseName: string; TableName: string; }>;

  public static systemErrorsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Timestream",
      "metricName": "SystemErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static successfulRequestLatencySampleCount(dimensions: { Operation: string; DatabaseName: string; TableName: string; }): MetricWithDims<{ Operation: string; DatabaseName: string; TableName: string; }>;

  public static successfulRequestLatencySampleCount(dimensions: { Operation: string; DatabaseName: string; TableName: string; }): MetricWithDims<{ Operation: string; DatabaseName: string; TableName: string; }>;

  public static successfulRequestLatencySampleCount(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Timestream",
      "metricName": "SuccessfulRequestLatency",
      "dimensionsMap": dimensions,
      "statistic": "SampleCount"
    };
  }

  public static successfulRequestLatencyp95(dimensions: { Operation: string; DatabaseName: string; TableName: string; }): MetricWithDims<{ Operation: string; DatabaseName: string; TableName: string; }> {
    return {
      "namespace": "AWS/Timestream",
      "metricName": "SuccessfulRequestLatency",
      "dimensionsMap": dimensions,
      "statistic": "p95"
    };
  }
}