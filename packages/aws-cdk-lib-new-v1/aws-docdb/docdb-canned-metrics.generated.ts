/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class DocDBMetrics {
  public static cpuUtilizationAverage(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }> {
    return {
      "namespace": "AWS/DocDB",
      "metricName": "CPUUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static databaseConnectionsAverage(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }> {
    return {
      "namespace": "AWS/DocDB",
      "metricName": "DatabaseConnections",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static engineUptimeAverage(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }> {
    return {
      "namespace": "AWS/DocDB",
      "metricName": "EngineUptime",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static readThroughputSum(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }> {
    return {
      "namespace": "AWS/DocDB",
      "metricName": "ReadThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static writeThroughputSum(dimensions: { DBInstanceIdentifier: string; }): MetricWithDims<{ DBInstanceIdentifier: string; }> {
    return {
      "namespace": "AWS/DocDB",
      "metricName": "WriteThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}