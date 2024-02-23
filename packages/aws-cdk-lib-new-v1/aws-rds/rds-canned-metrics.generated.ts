/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class RDSMetrics {
  public static cpuUtilizationAverage(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }>;

  public static cpuUtilizationAverage(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }>;

  public static cpuUtilizationAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/RDS",
      "metricName": "CPUUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static readLatencyAverage(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }>;

  public static readLatencyAverage(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }>;

  public static readLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/RDS",
      "metricName": "ReadLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static databaseConnectionsSum(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }>;

  public static databaseConnectionsSum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }>;

  public static databaseConnectionsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/RDS",
      "metricName": "DatabaseConnections",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static freeStorageSpaceAverage(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }>;

  public static freeStorageSpaceAverage(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }>;

  public static freeStorageSpaceAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/RDS",
      "metricName": "FreeStorageSpace",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static freeableMemoryAverage(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }>;

  public static freeableMemoryAverage(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }>;

  public static freeableMemoryAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/RDS",
      "metricName": "FreeableMemory",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static readThroughputAverage(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }>;

  public static readThroughputAverage(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }>;

  public static readThroughputAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/RDS",
      "metricName": "ReadThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static readIopsAverage(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }>;

  public static readIopsAverage(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }>;

  public static readIopsAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/RDS",
      "metricName": "ReadIOPS",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static writeLatencyAverage(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }>;

  public static writeLatencyAverage(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }>;

  public static writeLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/RDS",
      "metricName": "WriteLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static writeThroughputAverage(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }>;

  public static writeThroughputAverage(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }>;

  public static writeThroughputAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/RDS",
      "metricName": "WriteThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static writeIopsAverage(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }>;

  public static writeIopsAverage(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }>;

  public static writeIopsAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/RDS",
      "metricName": "WriteIOPS",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}