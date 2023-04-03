// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class LogsMetrics {
  public static incomingLogEventsSum(dimensions: { LogGroupName: string }) {
    return {
      namespace: 'AWS/Logs',
      metricName: 'IncomingLogEvents',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static incomingBytesSum(dimensions: { LogGroupName: string }) {
    return {
      namespace: 'AWS/Logs',
      metricName: 'IncomingBytes',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static deliveryErrorsSum(dimensions: { DestinationType: string, FilterName: string, LogGroupName: string }) {
    return {
      namespace: 'AWS/Logs',
      metricName: 'DeliveryErrors',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static deliveryThrottlingSum(dimensions: { DestinationType: string, FilterName: string, LogGroupName: string }) {
    return {
      namespace: 'AWS/Logs',
      metricName: 'DeliveryThrottling',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static forwardedBytesSum(dimensions: { DestinationType: string, FilterName: string, LogGroupName: string }) {
    return {
      namespace: 'AWS/Logs',
      metricName: 'ForwardedBytes',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static forwardedLogEventsSum(dimensions: { DestinationType: string, FilterName: string, LogGroupName: string }) {
    return {
      namespace: 'AWS/Logs',
      metricName: 'ForwardedLogEvents',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static throttleCountSum(dimensions: { DestinationType: string, FilterName: string, LogGroupName: string }) {
    return {
      namespace: 'AWS/Logs',
      metricName: 'ThrottleCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
