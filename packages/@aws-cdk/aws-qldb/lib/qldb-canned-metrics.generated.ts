// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class QLDBMetrics {
  public static commandLatencyAverage(dimensions: { LedgerName: string }) {
    return {
      namespace: 'AWS/QLDB',
      metricName: 'CommandLatency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static journalStorageSum(dimensions: { LedgerName: string }) {
    return {
      namespace: 'AWS/QLDB',
      metricName: 'JournalStorage',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static indexedStorageSum(dimensions: { LedgerName: string }) {
    return {
      namespace: 'AWS/QLDB',
      metricName: 'IndexedStorage',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static isImpairedSum(dimensions: { LedgerName: string }) {
    return {
      namespace: 'AWS/QLDB',
      metricName: 'IsImpaired',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static occConflictExceptionsSum(dimensions: { LedgerName: string }) {
    return {
      namespace: 'AWS/QLDB',
      metricName: 'OccConflictExceptions',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static readIOsSum(dimensions: { LedgerName: string }) {
    return {
      namespace: 'AWS/QLDB',
      metricName: 'ReadIOs',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static session4XxExceptionsSum(dimensions: { LedgerName: string }) {
    return {
      namespace: 'AWS/QLDB',
      metricName: 'Session4xxExceptions',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static session5XxExceptionsSum(dimensions: { LedgerName: string }) {
    return {
      namespace: 'AWS/QLDB',
      metricName: 'Session5xxExceptions',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static sessionRateExceededExceptionsSum(dimensions: { LedgerName: string }) {
    return {
      namespace: 'AWS/QLDB',
      metricName: 'SessionRateExceededExceptions',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static writeIOsSum(dimensions: { LedgerName: string }) {
    return {
      namespace: 'AWS/QLDB',
      metricName: 'WriteIOs',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
