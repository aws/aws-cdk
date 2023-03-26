// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class IoT1ClickMetrics {
  public static totalEventsSum(dimensions: { DeviceType: string }) {
    return {
      namespace: 'AWS/IoT1Click',
      metricName: 'TotalEvents',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static remainingLifeAverage(dimensions: { DeviceType: string }) {
    return {
      namespace: 'AWS/IoT1Click',
      metricName: 'RemainingLife',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static callbackInvocationErrorsSum(dimensions: { DeviceType: string }) {
    return {
      namespace: 'AWS/IoT1Click',
      metricName: 'CallbackInvocationErrors',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
