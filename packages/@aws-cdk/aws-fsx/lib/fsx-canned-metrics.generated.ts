// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class FSxMetrics {
  public static dataReadBytesSum(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/FSx',
      metricName: 'DataReadBytes',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static dataWriteBytesSum(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/FSx',
      metricName: 'DataWriteBytes',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static freeStorageCapacityAverage(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/FSx',
      metricName: 'FreeStorageCapacity',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static freeDataStorageCapacitySum(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/FSx',
      metricName: 'FreeDataStorageCapacity',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static dataReadOperationsSum(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/FSx',
      metricName: 'DataReadOperations',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static dataWriteOperationsSum(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/FSx',
      metricName: 'DataWriteOperations',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static metadataOperationsSum(dimensions: { FileSystemId: string }) {
    return {
      namespace: 'AWS/FSx',
      metricName: 'MetadataOperations',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
