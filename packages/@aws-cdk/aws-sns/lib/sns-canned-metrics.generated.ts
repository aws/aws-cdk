// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class SNSMetrics {
  public static numberOfNotificationsDeliveredSum(dimensions: { TopicName: string }) {
    return {
      namespace: 'AWS/SNS',
      metricName: 'NumberOfNotificationsDelivered',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static numberOfNotificationsFailedSum(dimensions: { TopicName: string }) {
    return {
      namespace: 'AWS/SNS',
      metricName: 'NumberOfNotificationsFailed',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static numberOfMessagesPublishedSum(dimensions: { TopicName: string }) {
    return {
      namespace: 'AWS/SNS',
      metricName: 'NumberOfMessagesPublished',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static publishSizeAverage(dimensions: { TopicName: string }) {
    return {
      namespace: 'AWS/SNS',
      metricName: 'PublishSize',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static smsSuccessRateSum(dimensions: { TopicName: string }) {
    return {
      namespace: 'AWS/SNS',
      metricName: 'SMSSuccessRate',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
