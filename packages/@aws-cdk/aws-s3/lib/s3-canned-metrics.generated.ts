// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class S3Metrics {
  public static bucketSizeBytesAverage(dimensions: { BucketName: string, StorageType: string }) {
    return {
      namespace: 'AWS/S3',
      metricName: 'BucketSizeBytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static numberOfObjectsAverage(dimensions: { BucketName: string, StorageType: string }) {
    return {
      namespace: 'AWS/S3',
      metricName: 'NumberOfObjects',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
