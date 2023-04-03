// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class Route53Metrics {
  public static healthCheckPercentageHealthyAverage(dimensions: { HealthCheckId: string }) {
    return {
      namespace: 'AWS/Route53',
      metricName: 'HealthCheckPercentageHealthy',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static connectionTimeAverage(dimensions: { HealthCheckId: string }) {
    return {
      namespace: 'AWS/Route53',
      metricName: 'ConnectionTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static healthCheckStatusMinimum(dimensions: { HealthCheckId: string }) {
    return {
      namespace: 'AWS/Route53',
      metricName: 'HealthCheckStatus',
      dimensionsMap: dimensions,
      statistic: 'Minimum',
    };
  }
  public static sslHandshakeTimeAverage(dimensions: { HealthCheckId: string }) {
    return {
      namespace: 'AWS/Route53',
      metricName: 'SSLHandshakeTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static childHealthCheckHealthyCountAverage(dimensions: { HealthCheckId: string }) {
    return {
      namespace: 'AWS/Route53',
      metricName: 'ChildHealthCheckHealthyCount',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static timeToFirstByteAverage(dimensions: { HealthCheckId: string }) {
    return {
      namespace: 'AWS/Route53',
      metricName: 'TimeToFirstByte',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
