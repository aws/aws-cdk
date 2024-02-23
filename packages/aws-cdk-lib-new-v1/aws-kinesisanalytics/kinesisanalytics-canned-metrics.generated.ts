/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class KinesisAnalyticsMetrics {
  public static kpUsAverage(dimensions: { Application: string; }): MetricWithDims<{ Application: string; }> {
    return {
      "namespace": "AWS/KinesisAnalytics",
      "metricName": "KPUs",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static millisBehindLatestAverage(dimensions: { Application: string; }): MetricWithDims<{ Application: string; }> {
    return {
      "namespace": "AWS/KinesisAnalytics",
      "metricName": "MillisBehindLatest",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}