// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class SQSMetrics {
  public static numberOfMessagesSentAverage(dimensions: { QueueName: string }) {
    return {
      namespace: 'AWS/SQS',
      metricName: 'NumberOfMessagesSent',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static approximateNumberOfMessagesDelayedAverage(dimensions: { QueueName: string }) {
    return {
      namespace: 'AWS/SQS',
      metricName: 'ApproximateNumberOfMessagesDelayed',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static numberOfMessagesReceivedAverage(dimensions: { QueueName: string }) {
    return {
      namespace: 'AWS/SQS',
      metricName: 'NumberOfMessagesReceived',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static numberOfMessagesDeletedAverage(dimensions: { QueueName: string }) {
    return {
      namespace: 'AWS/SQS',
      metricName: 'NumberOfMessagesDeleted',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static approximateNumberOfMessagesNotVisibleAverage(dimensions: { QueueName: string }) {
    return {
      namespace: 'AWS/SQS',
      metricName: 'ApproximateNumberOfMessagesNotVisible',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static approximateNumberOfMessagesVisibleAverage(dimensions: { QueueName: string }) {
    return {
      namespace: 'AWS/SQS',
      metricName: 'ApproximateNumberOfMessagesVisible',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static approximateAgeOfOldestMessageAverage(dimensions: { QueueName: string }) {
    return {
      namespace: 'AWS/SQS',
      metricName: 'ApproximateAgeOfOldestMessage',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static numberOfEmptyReceivesAverage(dimensions: { QueueName: string }) {
    return {
      namespace: 'AWS/SQS',
      metricName: 'NumberOfEmptyReceives',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static sentMessageSizeAverage(dimensions: { QueueName: string }) {
    return {
      namespace: 'AWS/SQS',
      metricName: 'SentMessageSize',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
