// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class MediaLiveMetrics {
  public static activeAlertsMaximum(dimensions: { ChannelId: string, Pipeline: string }) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'ActiveAlerts',
      dimensionsMap: dimensions,
      statistic: 'Maximum',
    };
  }
  public static inputVideoFrameRateAverage(dimensions: { ChannelId: string, Pipeline: string }): MetricWithDims<{ ChannelId: string, Pipeline: string }>;
  public static inputVideoFrameRateAverage(dimensions: { ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }): MetricWithDims<{ ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }>;
  public static inputVideoFrameRateAverage(dimensions: any) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'InputVideoFrameRate',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static fillMsecAverage(dimensions: { ChannelId: string, Pipeline: string }) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'FillMsec',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static inputLossSecondsSum(dimensions: { ChannelId: string, Pipeline: string }): MetricWithDims<{ ChannelId: string, Pipeline: string }>;
  public static inputLossSecondsSum(dimensions: { ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }): MetricWithDims<{ ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }>;
  public static inputLossSecondsSum(dimensions: any) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'InputLossSeconds',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static rtpPacketsReceivedSum(dimensions: { ChannelId: string, Pipeline: string }): MetricWithDims<{ ChannelId: string, Pipeline: string }>;
  public static rtpPacketsReceivedSum(dimensions: { ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }): MetricWithDims<{ ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }>;
  public static rtpPacketsReceivedSum(dimensions: any) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'RtpPacketsReceived',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static rtpPacketsRecoveredViaFecSum(dimensions: { ChannelId: string, Pipeline: string }): MetricWithDims<{ ChannelId: string, Pipeline: string }>;
  public static rtpPacketsRecoveredViaFecSum(dimensions: { ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }): MetricWithDims<{ ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }>;
  public static rtpPacketsRecoveredViaFecSum(dimensions: any) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'RtpPacketsRecoveredViaFec',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static rtpPacketsLostSum(dimensions: { ChannelId: string, Pipeline: string }): MetricWithDims<{ ChannelId: string, Pipeline: string }>;
  public static rtpPacketsLostSum(dimensions: { ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }): MetricWithDims<{ ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }>;
  public static rtpPacketsLostSum(dimensions: any) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'RtpPacketsLost',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static fecRowPacketsReceivedSum(dimensions: { ChannelId: string, Pipeline: string }): MetricWithDims<{ ChannelId: string, Pipeline: string }>;
  public static fecRowPacketsReceivedSum(dimensions: { ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }): MetricWithDims<{ ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }>;
  public static fecRowPacketsReceivedSum(dimensions: any) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'FecRowPacketsReceived',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static fecColumnPacketsReceivedSum(dimensions: { ChannelId: string, Pipeline: string }): MetricWithDims<{ ChannelId: string, Pipeline: string }>;
  public static fecColumnPacketsReceivedSum(dimensions: { ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }): MetricWithDims<{ ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }>;
  public static fecColumnPacketsReceivedSum(dimensions: any) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'FecColumnPacketsReceived',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static primaryInputActiveMinimum(dimensions: { ChannelId: string, Pipeline: string }) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'PrimaryInputActive',
      dimensionsMap: dimensions,
      statistic: 'Minimum',
    };
  }
  public static networkInAverage(dimensions: { ChannelId: string, Pipeline: string }) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'NetworkIn',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static networkOutAverage(dimensions: { ChannelId: string, Pipeline: string }) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'NetworkOut',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static pipelinesLockedMinimum(dimensions: { ChannelId: string, Pipeline: string }) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'PipelinesLocked',
      dimensionsMap: dimensions,
      statistic: 'Minimum',
    };
  }
  public static inputTimecodesPresentMinimum(dimensions: { ChannelId: string, Pipeline: string }): MetricWithDims<{ ChannelId: string, Pipeline: string }>;
  public static inputTimecodesPresentMinimum(dimensions: { ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }): MetricWithDims<{ ActiveInputFailoverLabel: string, ChannelId: string, Pipeline: string }>;
  public static inputTimecodesPresentMinimum(dimensions: any) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'InputTimecodesPresent',
      dimensionsMap: dimensions,
      statistic: 'Minimum',
    };
  }
  public static activeOutputsMaximum(dimensions: { ChannelId: string, OutputGroupName: string, Pipeline: string }) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'ActiveOutputs',
      dimensionsMap: dimensions,
      statistic: 'Maximum',
    };
  }
  public static output4XxErrorsSum(dimensions: { ChannelId: string, OutputGroupName: string, Pipeline: string }) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'Output4xxErrors',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static output5XxErrorsSum(dimensions: { ChannelId: string, OutputGroupName: string, Pipeline: string }) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'Output5xxErrors',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static audioLevelMaximum(dimensions: { AudioDescriptionName: string, ChannelId: string, Pipeline: string }) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'AudioLevel',
      dimensionsMap: dimensions,
      statistic: 'Maximum',
    };
  }
  public static outputAudioLevelDbfsMaximum(dimensions: { AudioDescriptionName: string, ChannelId: string, Pipeline: string }) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'OutputAudioLevelDbfs',
      dimensionsMap: dimensions,
      statistic: 'Maximum',
    };
  }
  public static outputAudioLevelLkfsMaximum(dimensions: { AudioDescriptionName: string, ChannelId: string, Pipeline: string }) {
    return {
      namespace: 'AWS/MediaLive',
      metricName: 'OutputAudioLevelLkfs',
      dimensionsMap: dimensions,
      statistic: 'Maximum',
    };
  }
}
type MetricWithDims<D> = { namespace: string, metricName: string, statistic: string, dimensionsMap: D };
