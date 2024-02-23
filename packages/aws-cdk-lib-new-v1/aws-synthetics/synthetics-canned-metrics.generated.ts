/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class CloudWatchSyntheticsMetrics {
  public static _2XxSum(dimensions: { CanaryName: string; }): MetricWithDims<{ CanaryName: string; }> {
    return {
      "namespace": "CloudWatchSynthetics",
      "metricName": "2xx",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static _4XxSum(dimensions: { CanaryName: string; }): MetricWithDims<{ CanaryName: string; }> {
    return {
      "namespace": "CloudWatchSynthetics",
      "metricName": "4xx",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static _5XxSum(dimensions: { CanaryName: string; }): MetricWithDims<{ CanaryName: string; }> {
    return {
      "namespace": "CloudWatchSynthetics",
      "metricName": "5xx",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static durationMaximum(dimensions: { CanaryName: string; }): MetricWithDims<{ CanaryName: string; }> {
    return {
      "namespace": "CloudWatchSynthetics",
      "metricName": "Duration",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }

  public static failedSum(dimensions: { CanaryName: string; }): MetricWithDims<{ CanaryName: string; }> {
    return {
      "namespace": "CloudWatchSynthetics",
      "metricName": "Failed",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static failedRequestsSum(dimensions: { CanaryName: string; }): MetricWithDims<{ CanaryName: string; }> {
    return {
      "namespace": "CloudWatchSynthetics",
      "metricName": "Failed requests",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static successPercentAverage(dimensions: { CanaryName: string; }): MetricWithDims<{ CanaryName: string; }> {
    return {
      "namespace": "CloudWatchSynthetics",
      "metricName": "SuccessPercent",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}