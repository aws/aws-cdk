// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class CloudWatchMetricStreamsMetrics {
  public static metricUpdateSum(dimensions: { MetricStreamName: string }) {
    return {
      namespace: 'AWS/CloudWatch/MetricStreams',
      metricName: 'MetricUpdate',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static publishErrorRateAverage(dimensions: { MetricStreamName: string }) {
    return {
      namespace: 'AWS/CloudWatch/MetricStreams',
      metricName: 'PublishErrorRate',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
