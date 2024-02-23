/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class QLDBMetrics {
  public static commandLatencyAverage(dimensions: { LedgerName: string; }): MetricWithDims<{ LedgerName: string; }> {
    return {
      "namespace": "AWS/QLDB",
      "metricName": "CommandLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static journalStorageSum(dimensions: { LedgerName: string; }): MetricWithDims<{ LedgerName: string; }> {
    return {
      "namespace": "AWS/QLDB",
      "metricName": "JournalStorage",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static indexedStorageSum(dimensions: { LedgerName: string; }): MetricWithDims<{ LedgerName: string; }> {
    return {
      "namespace": "AWS/QLDB",
      "metricName": "IndexedStorage",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static isImpairedSum(dimensions: { LedgerName: string; }): MetricWithDims<{ LedgerName: string; }> {
    return {
      "namespace": "AWS/QLDB",
      "metricName": "IsImpaired",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static occConflictExceptionsSum(dimensions: { LedgerName: string; }): MetricWithDims<{ LedgerName: string; }> {
    return {
      "namespace": "AWS/QLDB",
      "metricName": "OccConflictExceptions",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static readIOsSum(dimensions: { LedgerName: string; }): MetricWithDims<{ LedgerName: string; }> {
    return {
      "namespace": "AWS/QLDB",
      "metricName": "ReadIOs",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static session4XxExceptionsSum(dimensions: { LedgerName: string; }): MetricWithDims<{ LedgerName: string; }> {
    return {
      "namespace": "AWS/QLDB",
      "metricName": "Session4xxExceptions",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static session5XxExceptionsSum(dimensions: { LedgerName: string; }): MetricWithDims<{ LedgerName: string; }> {
    return {
      "namespace": "AWS/QLDB",
      "metricName": "Session5xxExceptions",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static sessionRateExceededExceptionsSum(dimensions: { LedgerName: string; }): MetricWithDims<{ LedgerName: string; }> {
    return {
      "namespace": "AWS/QLDB",
      "metricName": "SessionRateExceededExceptions",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static writeIOsSum(dimensions: { LedgerName: string; }): MetricWithDims<{ LedgerName: string; }> {
    return {
      "namespace": "AWS/QLDB",
      "metricName": "WriteIOs",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}