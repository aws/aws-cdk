// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class KinesisAnalyticsMetrics {
  public static kpUsAverage(dimensions: { Application: string }) {
    return {
      namespace: 'AWS/KinesisAnalytics',
      metricName: 'KPUs',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static millisBehindLatestAverage(dimensions: { Application: string }) {
    return {
      namespace: 'AWS/KinesisAnalytics',
      metricName: 'MillisBehindLatest',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
