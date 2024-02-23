/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class EFSMetrics {
  public static burstCreditBalanceAverage(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/EFS",
      "metricName": "BurstCreditBalance",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static clientConnectionsSum(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/EFS",
      "metricName": "ClientConnections",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static dataReadIoBytesAverage(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/EFS",
      "metricName": "DataReadIOBytes",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static dataWriteIoBytesAverage(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/EFS",
      "metricName": "DataWriteIOBytes",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static metaDataIoBytesAverage(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/EFS",
      "metricName": "MetaDataIOBytes",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static meteredIoBytesAverage(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/EFS",
      "metricName": "MeteredIOBytes",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static percentIoLimitAverage(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/EFS",
      "metricName": "PercentIOLimit",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static permittedThroughputAverage(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/EFS",
      "metricName": "PermittedThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static totalIoBytesSum(dimensions: { FileSystemId: string; }): MetricWithDims<{ FileSystemId: string; }> {
    return {
      "namespace": "AWS/EFS",
      "metricName": "TotalIOBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static storageBytesAverage(dimensions: { FileSystemId: string; StorageClass: string; }): MetricWithDims<{ FileSystemId: string; StorageClass: string; }> {
    return {
      "namespace": "AWS/EFS",
      "metricName": "StorageBytes",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}