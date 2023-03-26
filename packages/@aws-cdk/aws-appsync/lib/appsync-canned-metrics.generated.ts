// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class AppSyncMetrics {
  public static _4XxErrorSum(dimensions: { GraphQLAPIId: string }) {
    return {
      namespace: 'AWS/AppSync',
      metricName: '4XXError',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static _5XxErrorSum(dimensions: { GraphQLAPIId: string }) {
    return {
      namespace: 'AWS/AppSync',
      metricName: '5XXError',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static latencyAverage(dimensions: { GraphQLAPIId: string }) {
    return {
      namespace: 'AWS/AppSync',
      metricName: 'Latency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
