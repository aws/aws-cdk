// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class EFSMetrics {
  public static burstCreditBalanceAverage(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/EFS',
      metricName: 'BurstCreditBalance',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static clientConnectionsSum(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/EFS',
      metricName: 'ClientConnections',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static dataReadIoBytesAverage(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/EFS',
      metricName: 'DataReadIOBytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static dataWriteIoBytesAverage(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/EFS',
      metricName: 'DataWriteIOBytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static metaDataIoBytesAverage(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/EFS',
      metricName: 'MetaDataIOBytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static meteredIoBytesAverage(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/EFS',
      metricName: 'MeteredIOBytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static percentIoLimitAverage(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/EFS',
      metricName: 'PercentIOLimit',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static permittedThroughputAverage(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/EFS',
      metricName: 'PermittedThroughput',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static totalIoBytesSum(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/EFS',
      metricName: 'TotalIOBytes',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static storageBytesAverage(dimensions: { FileSystemId: string, StorageClass: string }) {
    return {
      namespace: 'AWS/EFS',
      metricName: 'StorageBytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
