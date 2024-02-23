/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class AppSyncMetrics {
  public static _4XxErrorSum(dimensions: { GraphQLAPIId: string; }): MetricWithDims<{ GraphQLAPIId: string; }> {
    return {
      "namespace": "AWS/AppSync",
      "metricName": "4XXError",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static _5XxErrorSum(dimensions: { GraphQLAPIId: string; }): MetricWithDims<{ GraphQLAPIId: string; }> {
    return {
      "namespace": "AWS/AppSync",
      "metricName": "5XXError",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static latencyAverage(dimensions: { GraphQLAPIId: string; }): MetricWithDims<{ GraphQLAPIId: string; }> {
    return {
      "namespace": "AWS/AppSync",
      "metricName": "Latency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}