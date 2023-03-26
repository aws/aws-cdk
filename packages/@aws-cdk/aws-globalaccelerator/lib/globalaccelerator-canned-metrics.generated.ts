// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class GlobalAcceleratorMetrics {
  public static newFlowCountSum(dimensions: { Accelerator: string }) {
    return {
      namespace: 'AWS/GlobalAccelerator',
      metricName: 'NewFlowCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static processedBytesInSum(dimensions: { Accelerator: string }) {
    return {
      namespace: 'AWS/GlobalAccelerator',
      metricName: 'ProcessedBytesIn',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static processedBytesOutSum(dimensions: { Accelerator: string }) {
    return {
      namespace: 'AWS/GlobalAccelerator',
      metricName: 'ProcessedBytesOut',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
