/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class TransferMetrics {
  public static bytesInSum(dimensions: { ServerId: string; }): MetricWithDims<{ ServerId: string; }> {
    return {
      "namespace": "AWS/Transfer",
      "metricName": "BytesIn",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static bytesOutSum(dimensions: { ServerId: string; }): MetricWithDims<{ ServerId: string; }> {
    return {
      "namespace": "AWS/Transfer",
      "metricName": "BytesOut",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}