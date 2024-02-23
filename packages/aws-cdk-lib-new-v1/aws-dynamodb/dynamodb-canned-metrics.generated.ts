/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class DynamoDBMetrics {
  public static conditionalCheckFailedRequestsSum(dimensions: { TableName: string; }): MetricWithDims<{ TableName: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ConditionalCheckFailedRequests",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static consumedReadCapacityUnitsSum(dimensions: { TableName: string; }): MetricWithDims<{ TableName: string; }>;

  public static consumedReadCapacityUnitsSum(dimensions: { TableName: string; GlobalSecondaryIndexName: string; }): MetricWithDims<{ TableName: string; GlobalSecondaryIndexName: string; }>;

  public static consumedReadCapacityUnitsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ConsumedReadCapacityUnits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static consumedWriteCapacityUnitsSum(dimensions: { TableName: string; }): MetricWithDims<{ TableName: string; }>;

  public static consumedWriteCapacityUnitsSum(dimensions: { TableName: string; GlobalSecondaryIndexName: string; }): MetricWithDims<{ TableName: string; GlobalSecondaryIndexName: string; }>;

  public static consumedWriteCapacityUnitsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ConsumedWriteCapacityUnits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static provisionedReadCapacityUnitsAverage(dimensions: { TableName: string; }): MetricWithDims<{ TableName: string; }>;

  public static provisionedReadCapacityUnitsAverage(dimensions: { TableName: string; GlobalSecondaryIndexName: string; }): MetricWithDims<{ TableName: string; GlobalSecondaryIndexName: string; }>;

  public static provisionedReadCapacityUnitsAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ProvisionedReadCapacityUnits",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static provisionedWriteCapacityUnitsAverage(dimensions: { TableName: string; }): MetricWithDims<{ TableName: string; }>;

  public static provisionedWriteCapacityUnitsAverage(dimensions: { TableName: string; GlobalSecondaryIndexName: string; }): MetricWithDims<{ TableName: string; GlobalSecondaryIndexName: string; }>;

  public static provisionedWriteCapacityUnitsAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ProvisionedWriteCapacityUnits",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static readThrottleEventsSum(dimensions: { TableName: string; }): MetricWithDims<{ TableName: string; }>;

  public static readThrottleEventsSum(dimensions: { TableName: string; GlobalSecondaryIndexName: string; }): MetricWithDims<{ TableName: string; GlobalSecondaryIndexName: string; }>;

  public static readThrottleEventsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ReadThrottleEvents",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static timeToLiveDeletedItemCountSum(dimensions: { TableName: string; }): MetricWithDims<{ TableName: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "TimeToLiveDeletedItemCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static transactionConflictAverage(dimensions: { TableName: string; }): MetricWithDims<{ TableName: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "TransactionConflict",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static writeThrottleEventsSum(dimensions: { TableName: string; }): MetricWithDims<{ TableName: string; }>;

  public static writeThrottleEventsSum(dimensions: { TableName: string; GlobalSecondaryIndexName: string; }): MetricWithDims<{ TableName: string; GlobalSecondaryIndexName: string; }>;

  public static writeThrottleEventsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "WriteThrottleEvents",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static successfulRequestLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "SuccessfulRequestLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static systemErrorsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "SystemErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static throttledRequestsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ThrottledRequests",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static returnedItemCountSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static returnedItemCountSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static returnedItemCountSum(dimensions: { TableName: string; Operation: string; }): MetricWithDims<{ TableName: string; Operation: string; }>;

  public static returnedItemCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ReturnedItemCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static onlineIndexConsumedWriteCapacitySum(dimensions: { TableName: string; GlobalSecondaryIndexName: string; }): MetricWithDims<{ TableName: string; GlobalSecondaryIndexName: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "OnlineIndexConsumedWriteCapacity",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static onlineIndexPercentageProgressAverage(dimensions: { TableName: string; GlobalSecondaryIndexName: string; }): MetricWithDims<{ TableName: string; GlobalSecondaryIndexName: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "OnlineIndexPercentageProgress",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static onlineIndexThrottleEventsSum(dimensions: { TableName: string; GlobalSecondaryIndexName: string; }): MetricWithDims<{ TableName: string; GlobalSecondaryIndexName: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "OnlineIndexThrottleEvents",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static ageOfOldestUnreplicatedRecordAverage(dimensions: { TableName: string; DelegatedOperation: string; }): MetricWithDims<{ TableName: string; DelegatedOperation: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "AgeOfOldestUnreplicatedRecord",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static consumedChangeDataCaptureUnitsAverage(dimensions: { TableName: string; DelegatedOperation: string; }): MetricWithDims<{ TableName: string; DelegatedOperation: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ConsumedChangeDataCaptureUnits",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static throttledPutRecordCountAverage(dimensions: { TableName: string; DelegatedOperation: string; }): MetricWithDims<{ TableName: string; DelegatedOperation: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ThrottledPutRecordCount",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static pendingReplicationCountAverage(dimensions: { TableName: string; ReceivingRegion: string; }): MetricWithDims<{ TableName: string; ReceivingRegion: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "PendingReplicationCount",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static replicationLatencyAverage(dimensions: { TableName: string; ReceivingRegion: string; }): MetricWithDims<{ TableName: string; ReceivingRegion: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ReplicationLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static returnedBytesAverage(dimensions: { TableName: string; StreamLabel: string; Operation: string; }): MetricWithDims<{ TableName: string; StreamLabel: string; Operation: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ReturnedBytes",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static returnedRecordsCountAverage(dimensions: { TableName: string; StreamLabel: string; Operation: string; }): MetricWithDims<{ TableName: string; StreamLabel: string; Operation: string; }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "ReturnedRecordsCount",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static accountMaxReadsMaximum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "AccountMaxReads",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }

  public static accountMaxTableLevelReadsMaximum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "AccountMaxTableLevelReads",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }

  public static accountMaxTableLevelWritesMaximum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "AccountMaxTableLevelWrites",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }

  public static accountMaxWritesMaximum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "AccountMaxWrites",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }

  public static accountProvisionedReadCapacityUtilizationAverage(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "AccountProvisionedReadCapacityUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static accountProvisionedWriteCapacityUtilizationAverage(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "AccountProvisionedWriteCapacityUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static maxProvisionedTableReadCapacityUtilizationAverage(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "MaxProvisionedTableReadCapacityUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static maxProvisionedTableWriteCapacityUtilizationAverage(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "MaxProvisionedTableWriteCapacityUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static userErrorsSum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DynamoDB",
      "metricName": "UserErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}