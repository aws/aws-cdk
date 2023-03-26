// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class DAXMetrics {
  public static cpuUtilizationAverage(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'CPUUtilization',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static failedRequestCountSum(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'FailedRequestCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static batchGetItemRequestCountSum(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'BatchGetItemRequestCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static errorRequestCountSum(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'ErrorRequestCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static estimatedDbSizeAverage(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'EstimatedDbSize',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static evictedSizeAverage(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'EvictedSize',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static faultRequestCountSum(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'FaultRequestCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static getItemRequestCountSum(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'GetItemRequestCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static itemCacheHitsSum(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'ItemCacheHits',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static itemCacheMissesSum(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'ItemCacheMisses',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static queryCacheHitsSum(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'QueryCacheHits',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static queryRequestCountSum(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'QueryRequestCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static scanCacheHitsSum(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'ScanCacheHits',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static totalRequestCountSum(dimensions: {  }) {
    return {
      namespace: 'AWS/DAX',
      metricName: 'TotalRequestCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
