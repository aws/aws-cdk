// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class TransferMetrics {
  public static bytesInSum(dimensions: { ServerId: string }) {
    return {
      namespace: 'AWS/Transfer',
      metricName: 'BytesIn',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static bytesOutSum(dimensions: { ServerId: string }) {
    return {
      namespace: 'AWS/Transfer',
      metricName: 'BytesOut',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
