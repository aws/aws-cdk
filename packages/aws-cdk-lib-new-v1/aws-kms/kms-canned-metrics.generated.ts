/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class KMSMetrics {
  public static secondsUntilKeyMaterialExpirationAverage(dimensions: { KeyId: string; }): MetricWithDims<{ KeyId: string; }> {
    return {
      "namespace": "AWS/KMS",
      "metricName": "SecondsUntilKeyMaterialExpiration",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}