// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class MediaConvertMetrics {
  public static transcodingTimeAverage(dimensions: { Queue: string }) {
    return {
      namespace: 'AWS/MediaConvert',
      metricName: 'TranscodingTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static jobsCompletedCountSum(dimensions: { Queue: string }) {
    return {
      namespace: 'AWS/MediaConvert',
      metricName: 'JobsCompletedCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static _8KOutputDurationAverage(dimensions: { Queue: string }) {
    return {
      namespace: 'AWS/MediaConvert',
      metricName: '8KOutputDuration',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static audioOutputDurationAverage(dimensions: { Queue: string }) {
    return {
      namespace: 'AWS/MediaConvert',
      metricName: 'AudioOutputDuration',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static hdOutputDurationAverage(dimensions: { Queue: string }) {
    return {
      namespace: 'AWS/MediaConvert',
      metricName: 'HDOutputDuration',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static jobsErroredCountSum(dimensions: { Queue: string }) {
    return {
      namespace: 'AWS/MediaConvert',
      metricName: 'JobsErroredCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static sdOutputDurationAverage(dimensions: { Queue: string }) {
    return {
      namespace: 'AWS/MediaConvert',
      metricName: 'SDOutputDuration',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static standbyTimeSum(dimensions: { Queue: string }) {
    return {
      namespace: 'AWS/MediaConvert',
      metricName: 'StandbyTime',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static uhdOutputDurationAverage(dimensions: { Queue: string }) {
    return {
      namespace: 'AWS/MediaConvert',
      metricName: 'UHDOutputDuration',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
