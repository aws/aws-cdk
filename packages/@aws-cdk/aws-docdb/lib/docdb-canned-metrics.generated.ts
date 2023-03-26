// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class DocDBMetrics {
  public static cpuUtilizationAverage(dimensions: { DBInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DocDB',
      metricName: 'CPUUtilization',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static databaseConnectionsAverage(dimensions: { DBInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DocDB',
      metricName: 'DatabaseConnections',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static engineUptimeAverage(dimensions: { DBInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DocDB',
      metricName: 'EngineUptime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static readThroughputSum(dimensions: { DBInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DocDB',
      metricName: 'ReadThroughput',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static writeThroughputSum(dimensions: { DBInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DocDB',
      metricName: 'WriteThroughput',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
