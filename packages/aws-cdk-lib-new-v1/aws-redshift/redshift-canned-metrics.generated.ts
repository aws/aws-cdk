/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class RedshiftMetrics {
  public static commitQueueLengthAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "CommitQueueLength",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static concurrencyScalingActiveClustersAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "ConcurrencyScalingActiveClusters",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static concurrencyScalingSecondsAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "ConcurrencyScalingSeconds",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static cpuUtilizationAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }>;

  public static cpuUtilizationAverage(dimensions: { ClusterIdentifier: string; NodeID: string; }): MetricWithDims<{ ClusterIdentifier: string; NodeID: string; }>;

  public static cpuUtilizationAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "CPUUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static databaseConnectionsAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "DatabaseConnections",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static healthStatusSum(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "HealthStatus",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static maintenanceModeSum(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "MaintenanceMode",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static maxConfiguredConcurrencyScalingClustersSum(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "MaxConfiguredConcurrencyScalingClusters",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static networkReceiveThroughputSum(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "NetworkReceiveThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static networkTransmitThroughputSum(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "NetworkTransmitThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static numExceededSchemaQuotasAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "NumExceededSchemaQuotas",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static percentageDiskSpaceUsedAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "PercentageDiskSpaceUsed",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static percentageQuotaUsedAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "PercentageQuotaUsed",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static queriesCompletedPerSecondSum(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "QueriesCompletedPerSecond",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static queryDurationAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "QueryDuration",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static queryRuntimeBreakdownSum(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "QueryRuntimeBreakdown",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static readIopsSum(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "ReadIOPS",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static readLatencyAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }>;

  public static readLatencyAverage(dimensions: { ClusterIdentifier: string; NodeID: string; }): MetricWithDims<{ ClusterIdentifier: string; NodeID: string; }>;

  public static readLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "ReadLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static readThroughputSum(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "ReadThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static storageUsedAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "StorageUsed",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static totalTableCountAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "TotalTableCount",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static wlmQueriesCompletedPerSecondAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }>;

  public static wlmQueriesCompletedPerSecondAverage(dimensions: { ClusterIdentifier: string; wlmid: string; }): MetricWithDims<{ ClusterIdentifier: string; wlmid: string; }>;

  public static wlmQueriesCompletedPerSecondAverage(dimensions: { ClusterIdentifier: string; QueueName: string; }): MetricWithDims<{ ClusterIdentifier: string; QueueName: string; }>;

  public static wlmQueriesCompletedPerSecondAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "WLMQueriesCompletedPerSecond",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static wlmQueryDurationAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }>;

  public static wlmQueryDurationAverage(dimensions: { ClusterIdentifier: string; wlmid: string; }): MetricWithDims<{ ClusterIdentifier: string; wlmid: string; }>;

  public static wlmQueryDurationAverage(dimensions: { ClusterIdentifier: string; QueueName: string; }): MetricWithDims<{ ClusterIdentifier: string; QueueName: string; }>;

  public static wlmQueryDurationAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "WLMQueryDuration",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static wlmQueueLengthSum(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "WLMQueueLength",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static writeIopsSum(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "WriteIOPS",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static writeLatencyAverage(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }>;

  public static writeLatencyAverage(dimensions: { ClusterIdentifier: string; NodeID: string; }): MetricWithDims<{ ClusterIdentifier: string; NodeID: string; }>;

  public static writeLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "WriteLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static writeThroughputSum(dimensions: { ClusterIdentifier: string; }): MetricWithDims<{ ClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "WriteThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static networkReceiveThroughputAverage(dimensions: { ClusterIdentifier: string; NodeID: string; }): MetricWithDims<{ ClusterIdentifier: string; NodeID: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "NetworkReceiveThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static networkTransmitThroughputAverage(dimensions: { ClusterIdentifier: string; NodeID: string; }): MetricWithDims<{ ClusterIdentifier: string; NodeID: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "NetworkTransmitThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static readIopsAverage(dimensions: { ClusterIdentifier: string; NodeID: string; }): MetricWithDims<{ ClusterIdentifier: string; NodeID: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "ReadIOPS",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static readThroughputAverage(dimensions: { ClusterIdentifier: string; NodeID: string; }): MetricWithDims<{ ClusterIdentifier: string; NodeID: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "ReadThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static writeIopsAverage(dimensions: { ClusterIdentifier: string; NodeID: string; }): MetricWithDims<{ ClusterIdentifier: string; NodeID: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "WriteIOPS",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static writeThroughputAverage(dimensions: { ClusterIdentifier: string; NodeID: string; }): MetricWithDims<{ ClusterIdentifier: string; NodeID: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "WriteThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static queriesCompletedPerSecondAverage(dimensions: { ClusterIdentifier: string; wlmid: string; }): MetricWithDims<{ ClusterIdentifier: string; wlmid: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "QueriesCompletedPerSecond",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static wlmQueueWaitTimeAverage(dimensions: { ClusterIdentifier: string; wlmid: string; }): MetricWithDims<{ ClusterIdentifier: string; wlmid: string; }>;

  public static wlmQueueWaitTimeAverage(dimensions: { ClusterIdentifier: string; QueueName: string; }): MetricWithDims<{ ClusterIdentifier: string; QueueName: string; }>;

  public static wlmQueueWaitTimeAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "WLMQueueWaitTime",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static wlmRunningQueriesAverage(dimensions: { ClusterIdentifier: string; wlmid: string; }): MetricWithDims<{ ClusterIdentifier: string; wlmid: string; }>;

  public static wlmRunningQueriesAverage(dimensions: { ClusterIdentifier: string; QueueName: string; }): MetricWithDims<{ ClusterIdentifier: string; QueueName: string; }>;

  public static wlmRunningQueriesAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "WLMRunningQueries",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static wlmQueueLengthAverage(dimensions: { ClusterIdentifier: string; QueueName: string; }): MetricWithDims<{ ClusterIdentifier: string; QueueName: string; }> {
    return {
      "namespace": "AWS/Redshift",
      "metricName": "WLMQueueLength",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}