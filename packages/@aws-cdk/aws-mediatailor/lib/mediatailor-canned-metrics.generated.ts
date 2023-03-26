// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class MediaTailorMetrics {
  public static adDecisionServerAdsSum(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'AdDecisionServer.Ads',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static adDecisionServerDurationAverage(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'AdDecisionServer.Duration',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static adDecisionServerErrorsSum(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'AdDecisionServer.Errors',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static adDecisionServerFillRateSum(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'AdDecisionServer.FillRate',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static adDecisionServerLatencyAverage(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'AdDecisionServer.Latency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static adNotReadySum(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'AdNotReady',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static availDurationSum(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'Avail.Duration',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static availFillRateSum(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'Avail.FillRate',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static availFilledDurationAverage(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'Avail.FilledDuration',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static getManifestErrorsSum(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'GetManifest.Errors',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static getManifestLatencyAverage(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'GetManifest.Latency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static originErrorsSum(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'Origin.Errors',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static originLatencyAverage(dimensions: { ConfigurationName: string }) {
    return {
      namespace: 'AWS/MediaTailor',
      metricName: 'Origin.Latency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
