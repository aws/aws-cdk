// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class KinesisVideoMetrics {
  public static getMediaSuccessSum(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/KinesisVideo',
      metricName: 'GetMedia.Success',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static putMediaSuccessSum(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/KinesisVideo',
      metricName: 'PutMedia.Success',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static getMediaMillisBehindNowSum(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/KinesisVideo',
      metricName: 'GetMedia.MillisBehindNow',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static listFragmentsLatencySum(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/KinesisVideo',
      metricName: 'ListFragments.Latency',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static putMediaFragmentIngestionLatencySum(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/KinesisVideo',
      metricName: 'PutMedia.FragmentIngestionLatency',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static putMediaFragmentPersistLatencySum(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/KinesisVideo',
      metricName: 'PutMedia.FragmentPersistLatency',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static putMediaIncomingBytesSum(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/KinesisVideo',
      metricName: 'PutMedia.IncomingBytes',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static putMediaIncomingFramesSum(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/KinesisVideo',
      metricName: 'PutMedia.IncomingFrames',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
