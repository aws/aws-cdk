/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class FSxMetrics {
  public static dataReadBytesSum(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/FSx",
      "metricName": "DataReadBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static dataWriteBytesSum(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/FSx",
      "metricName": "DataWriteBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static freeStorageCapacityAverage(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/FSx",
      "metricName": "FreeStorageCapacity",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static freeDataStorageCapacitySum(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/FSx",
      "metricName": "FreeDataStorageCapacity",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static dataReadOperationsSum(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/FSx",
      "metricName": "DataReadOperations",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static dataWriteOperationsSum(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/FSx",
      "metricName": "DataWriteOperations",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static metadataOperationsSum(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/FSx",
      "metricName": "MetadataOperations",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}