/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class AmazonMQMetrics {
  public static ackRateAverage(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "AckRate",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static channelCountSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "ChannelCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static confirmRateAverage(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "ConfirmRate",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static connectionCountSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "ConnectionCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static consumerCountSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "ConsumerCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static cpuCreditBalanceHeapUsageMaximum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "CpuCreditBalanceHeapUsage",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }

  public static cpuUtilizationAverage(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "CpuUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static currentConnectionsCountSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "CurrentConnectionsCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static exchangeCountSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "ExchangeCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static messageCountSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "MessageCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static messageReadyCountSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "MessageReadyCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static messageUnacknowledgedCountSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "MessageUnacknowledgedCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static networkInSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "NetworkIn",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static networkOutSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "NetworkOut",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static publishRateAverage(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "PublishRate",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static queueCountSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "QueueCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static totalConsumerCountSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "TotalConsumerCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static totalMessageCountSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "TotalMessageCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static totalProducerCountSum(dimensions: { Broker: string; }): MetricWithDims<{ Broker: string; }> {
    return {
      "namespace": "AWS/AmazonMQ",
      "metricName": "TotalProducerCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}