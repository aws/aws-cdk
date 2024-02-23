/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class MediaLiveMetrics {
  public static activeAlertsMaximum(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "ActiveAlerts",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }

  public static inputVideoFrameRateAverage(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "InputVideoFrameRate",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static fillMsecAverage(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "FillMsec",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static inputLossSecondsSum(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "InputLossSeconds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static rtpPacketsReceivedSum(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "RtpPacketsReceived",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static rtpPacketsRecoveredViaFecSum(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "RtpPacketsRecoveredViaFec",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static rtpPacketsLostSum(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "RtpPacketsLost",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static fecRowPacketsReceivedSum(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "FecRowPacketsReceived",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static fecColumnPacketsReceivedSum(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "FecColumnPacketsReceived",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static primaryInputActiveMinimum(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "PrimaryInputActive",
      "dimensionsMap": dimensions,
      "statistic": "Minimum"
    };
  }

  public static networkInAverage(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "NetworkIn",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static networkOutAverage(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "NetworkOut",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static pipelinesLockedMinimum(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "PipelinesLocked",
      "dimensionsMap": dimensions,
      "statistic": "Minimum"
    };
  }

  public static inputTimecodesPresentMinimum(dimensions: { ChannelId: string; Pipeline: string; }): MetricWithDims<{ ChannelId: string; Pipeline: string; }> {
    return {
      "namespace": "AWS/MediaLive",
      "metricName": "InputTimecodesPresent",
      "dimensionsMap": dimensions,
      "statistic": "Minimum"
    };
  }
}