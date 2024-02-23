/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class DAXMetrics {
  public static cpuUtilizationAverage(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "CPUUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static failedRequestCountSum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "FailedRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static batchGetItemRequestCountSum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "BatchGetItemRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static errorRequestCountSum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "ErrorRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static estimatedDbSizeAverage(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "EstimatedDbSize",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static evictedSizeAverage(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "EvictedSize",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static faultRequestCountSum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "FaultRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static getItemRequestCountSum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "GetItemRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static itemCacheHitsSum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "ItemCacheHits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static itemCacheMissesSum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "ItemCacheMisses",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static queryCacheHitsSum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "QueryCacheHits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static queryRequestCountSum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "QueryRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static scanCacheHitsSum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "ScanCacheHits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static totalRequestCountSum(dimensions: {  }): MetricWithDims<{  }> {
    return {
      "namespace": "AWS/DAX",
      "metricName": "TotalRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}