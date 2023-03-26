// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class DynamoDBMetrics {
  public static conditionalCheckFailedRequestsSum(dimensions: { TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ConditionalCheckFailedRequests',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static consumedReadCapacityUnitsSum(dimensions: { TableName: string }): MetricWithDims<{ TableName: string }>;
  public static consumedReadCapacityUnitsSum(dimensions: { GlobalSecondaryIndexName: string, TableName: string }): MetricWithDims<{ GlobalSecondaryIndexName: string, TableName: string }>;
  public static consumedReadCapacityUnitsSum(dimensions: any) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ConsumedReadCapacityUnits',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static consumedWriteCapacityUnitsSum(dimensions: { TableName: string }): MetricWithDims<{ TableName: string }>;
  public static consumedWriteCapacityUnitsSum(dimensions: { GlobalSecondaryIndexName: string, TableName: string }): MetricWithDims<{ GlobalSecondaryIndexName: string, TableName: string }>;
  public static consumedWriteCapacityUnitsSum(dimensions: any) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ConsumedWriteCapacityUnits',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static provisionedReadCapacityUnitsAverage(dimensions: { TableName: string }): MetricWithDims<{ TableName: string }>;
  public static provisionedReadCapacityUnitsAverage(dimensions: { GlobalSecondaryIndexName: string, TableName: string }): MetricWithDims<{ GlobalSecondaryIndexName: string, TableName: string }>;
  public static provisionedReadCapacityUnitsAverage(dimensions: any) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ProvisionedReadCapacityUnits',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static provisionedWriteCapacityUnitsAverage(dimensions: { TableName: string }): MetricWithDims<{ TableName: string }>;
  public static provisionedWriteCapacityUnitsAverage(dimensions: { GlobalSecondaryIndexName: string, TableName: string }): MetricWithDims<{ GlobalSecondaryIndexName: string, TableName: string }>;
  public static provisionedWriteCapacityUnitsAverage(dimensions: any) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ProvisionedWriteCapacityUnits',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static readThrottleEventsSum(dimensions: { TableName: string }): MetricWithDims<{ TableName: string }>;
  public static readThrottleEventsSum(dimensions: { GlobalSecondaryIndexName: string, TableName: string }): MetricWithDims<{ GlobalSecondaryIndexName: string, TableName: string }>;
  public static readThrottleEventsSum(dimensions: any) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ReadThrottleEvents',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static timeToLiveDeletedItemCountSum(dimensions: { TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'TimeToLiveDeletedItemCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static transactionConflictAverage(dimensions: { TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'TransactionConflict',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static writeThrottleEventsSum(dimensions: { TableName: string }): MetricWithDims<{ TableName: string }>;
  public static writeThrottleEventsSum(dimensions: { GlobalSecondaryIndexName: string, TableName: string }): MetricWithDims<{ GlobalSecondaryIndexName: string, TableName: string }>;
  public static writeThrottleEventsSum(dimensions: any) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'WriteThrottleEvents',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static successfulRequestLatencyAverage(dimensions: { Operation: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'SuccessfulRequestLatency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static systemErrorsSum(dimensions: { Operation: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'SystemErrors',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static throttledRequestsSum(dimensions: { Operation: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ThrottledRequests',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static returnedItemCountSum(dimensions: { Operation: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ReturnedItemCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static onlineIndexConsumedWriteCapacitySum(dimensions: { GlobalSecondaryIndexName: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'OnlineIndexConsumedWriteCapacity',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static onlineIndexPercentageProgressAverage(dimensions: { GlobalSecondaryIndexName: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'OnlineIndexPercentageProgress',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static onlineIndexThrottleEventsSum(dimensions: { GlobalSecondaryIndexName: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'OnlineIndexThrottleEvents',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static ageOfOldestUnreplicatedRecordAverage(dimensions: { DelegatedOperation: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'AgeOfOldestUnreplicatedRecord',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static consumedChangeDataCaptureUnitsAverage(dimensions: { DelegatedOperation: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ConsumedChangeDataCaptureUnits',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static throttledPutRecordCountAverage(dimensions: { DelegatedOperation: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ThrottledPutRecordCount',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static pendingReplicationCountAverage(dimensions: { ReceivingRegion: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'PendingReplicationCount',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static replicationLatencyAverage(dimensions: { ReceivingRegion: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ReplicationLatency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static returnedBytesAverage(dimensions: { Operation: string, StreamLabel: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ReturnedBytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static returnedRecordsCountAverage(dimensions: { Operation: string, StreamLabel: string, TableName: string }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'ReturnedRecordsCount',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static accountMaxReadsMaximum(dimensions: {  }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'AccountMaxReads',
      dimensionsMap: dimensions,
      statistic: 'Maximum',
    };
  }
  public static accountMaxTableLevelReadsMaximum(dimensions: {  }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'AccountMaxTableLevelReads',
      dimensionsMap: dimensions,
      statistic: 'Maximum',
    };
  }
  public static accountMaxTableLevelWritesMaximum(dimensions: {  }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'AccountMaxTableLevelWrites',
      dimensionsMap: dimensions,
      statistic: 'Maximum',
    };
  }
  public static accountMaxWritesMaximum(dimensions: {  }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'AccountMaxWrites',
      dimensionsMap: dimensions,
      statistic: 'Maximum',
    };
  }
  public static accountProvisionedReadCapacityUtilizationAverage(dimensions: {  }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'AccountProvisionedReadCapacityUtilization',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static accountProvisionedWriteCapacityUtilizationAverage(dimensions: {  }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'AccountProvisionedWriteCapacityUtilization',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static maxProvisionedTableReadCapacityUtilizationAverage(dimensions: {  }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'MaxProvisionedTableReadCapacityUtilization',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static maxProvisionedTableWriteCapacityUtilizationAverage(dimensions: {  }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'MaxProvisionedTableWriteCapacityUtilization',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static userErrorsSum(dimensions: {  }) {
    return {
      namespace: 'AWS/DynamoDB',
      metricName: 'UserErrors',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
type MetricWithDims<D> = { namespace: string, metricName: string, statistic: string, dimensionsMap: D };
