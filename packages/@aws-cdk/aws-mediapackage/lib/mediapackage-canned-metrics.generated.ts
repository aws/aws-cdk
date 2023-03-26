// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class MediaPackageMetrics {
  public static egressRequestCountSum(dimensions: { Channel: string }) {
    return {
      namespace: 'AWS/MediaPackage',
      metricName: 'EgressRequestCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static egressResponseTimeAverage(dimensions: { Channel: string }) {
    return {
      namespace: 'AWS/MediaPackage',
      metricName: 'EgressResponseTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static egressBytesSum(dimensions: { Channel: string }) {
    return {
      namespace: 'AWS/MediaPackage',
      metricName: 'EgressBytes',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
