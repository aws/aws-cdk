/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class MediaPackageMetrics {
  public static egressRequestCountSum(dimensions: { Channel: string; }): MetricWithDims<{ Channel: string; }> {
    return {
      "namespace": "AWS/MediaPackage",
      "metricName": "EgressRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static egressResponseTimeAverage(dimensions: { Channel: string; }): MetricWithDims<{ Channel: string; }> {
    return {
      "namespace": "AWS/MediaPackage",
      "metricName": "EgressResponseTime",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static egressBytesSum(dimensions: { Channel: string; }): MetricWithDims<{ Channel: string; }> {
    return {
      "namespace": "AWS/MediaPackage",
      "metricName": "EgressBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}