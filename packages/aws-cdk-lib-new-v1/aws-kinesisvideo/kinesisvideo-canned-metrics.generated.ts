/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class KinesisVideoMetrics {
  public static getMediaSuccessSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/KinesisVideo",
      "metricName": "GetMedia.Success",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static putMediaSuccessSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/KinesisVideo",
      "metricName": "PutMedia.Success",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static getMediaMillisBehindNowSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/KinesisVideo",
      "metricName": "GetMedia.MillisBehindNow",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static listFragmentsLatencySum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/KinesisVideo",
      "metricName": "ListFragments.Latency",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static putMediaFragmentIngestionLatencySum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/KinesisVideo",
      "metricName": "PutMedia.FragmentIngestionLatency",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static putMediaFragmentPersistLatencySum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/KinesisVideo",
      "metricName": "PutMedia.FragmentPersistLatency",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static putMediaIncomingBytesSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/KinesisVideo",
      "metricName": "PutMedia.IncomingBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static putMediaIncomingFramesSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/KinesisVideo",
      "metricName": "PutMedia.IncomingFrames",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}