/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class CloudWatchMetricStreamsMetrics {
  public static metricUpdateSum(dimensions: { MetricStreamName: string; }): MetricWithDims<{ MetricStreamName: string; }> {
    return {
      "namespace": "AWS/CloudWatch/MetricStreams",
      "metricName": "MetricUpdate",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static publishErrorRateAverage(dimensions: { MetricStreamName: string; }): MetricWithDims<{ MetricStreamName: string; }> {
    return {
      "namespace": "AWS/CloudWatch/MetricStreams",
      "metricName": "PublishErrorRate",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}