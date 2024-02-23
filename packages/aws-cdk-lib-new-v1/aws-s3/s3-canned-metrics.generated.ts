/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class S3Metrics {
  public static bucketSizeBytesAverage(dimensions: { BucketName: string; StorageType: string; }): MetricWithDims<{ BucketName: string; StorageType: string; }> {
    return {
      "namespace": "AWS/S3",
      "metricName": "BucketSizeBytes",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static numberOfObjectsAverage(dimensions: { BucketName: string; StorageType: string; }): MetricWithDims<{ BucketName: string; StorageType: string; }> {
    return {
      "namespace": "AWS/S3",
      "metricName": "NumberOfObjects",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}