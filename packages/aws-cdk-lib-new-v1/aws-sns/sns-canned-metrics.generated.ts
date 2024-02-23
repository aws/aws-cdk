/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class SNSMetrics {
  public static numberOfNotificationsDeliveredSum(dimensions: { TopicName: string; }): MetricWithDims<{ TopicName: string; }> {
    return {
      "namespace": "AWS/SNS",
      "metricName": "NumberOfNotificationsDelivered",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static numberOfNotificationsFailedSum(dimensions: { TopicName: string; }): MetricWithDims<{ TopicName: string; }> {
    return {
      "namespace": "AWS/SNS",
      "metricName": "NumberOfNotificationsFailed",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static numberOfMessagesPublishedSum(dimensions: { TopicName: string; }): MetricWithDims<{ TopicName: string; }> {
    return {
      "namespace": "AWS/SNS",
      "metricName": "NumberOfMessagesPublished",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static publishSizeAverage(dimensions: { TopicName: string; }): MetricWithDims<{ TopicName: string; }> {
    return {
      "namespace": "AWS/SNS",
      "metricName": "PublishSize",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static smsSuccessRateSum(dimensions: { TopicName: string; }): MetricWithDims<{ TopicName: string; }> {
    return {
      "namespace": "AWS/SNS",
      "metricName": "SMSSuccessRate",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}