/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class ApiGatewayMetrics {
  public static _4XxErrorSum(dimensions: { ApiName: string; Stage: string; }): MetricWithDims<{ ApiName: string; Stage: string; }>;

  public static _4XxErrorSum(dimensions: { ApiName: string; }): MetricWithDims<{ ApiName: string; }>;

  public static _4XxErrorSum(dimensions: { ApiName: string; Method: string; Resource: string; Stage: string; }): MetricWithDims<{ ApiName: string; Method: string; Resource: string; Stage: string; }>;

  public static _4XxErrorSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApiGateway",
      "metricName": "4XXError",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static _5XxErrorSum(dimensions: { ApiName: string; Stage: string; }): MetricWithDims<{ ApiName: string; Stage: string; }>;

  public static _5XxErrorSum(dimensions: { ApiName: string; }): MetricWithDims<{ ApiName: string; }>;

  public static _5XxErrorSum(dimensions: { ApiName: string; Method: string; Resource: string; Stage: string; }): MetricWithDims<{ ApiName: string; Method: string; Resource: string; Stage: string; }>;

  public static _5XxErrorSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApiGateway",
      "metricName": "5XXError",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static cacheHitCountSum(dimensions: { ApiName: string; Stage: string; }): MetricWithDims<{ ApiName: string; Stage: string; }>;

  public static cacheHitCountSum(dimensions: { ApiName: string; }): MetricWithDims<{ ApiName: string; }>;

  public static cacheHitCountSum(dimensions: { ApiName: string; Method: string; Resource: string; Stage: string; }): MetricWithDims<{ ApiName: string; Method: string; Resource: string; Stage: string; }>;

  public static cacheHitCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApiGateway",
      "metricName": "CacheHitCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static cacheMissCountSum(dimensions: { ApiName: string; Stage: string; }): MetricWithDims<{ ApiName: string; Stage: string; }>;

  public static cacheMissCountSum(dimensions: { ApiName: string; }): MetricWithDims<{ ApiName: string; }>;

  public static cacheMissCountSum(dimensions: { ApiName: string; Method: string; Resource: string; Stage: string; }): MetricWithDims<{ ApiName: string; Method: string; Resource: string; Stage: string; }>;

  public static cacheMissCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApiGateway",
      "metricName": "CacheMissCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static countSum(dimensions: { ApiName: string; Stage: string; }): MetricWithDims<{ ApiName: string; Stage: string; }>;

  public static countSum(dimensions: { ApiName: string; }): MetricWithDims<{ ApiName: string; }>;

  public static countSum(dimensions: { ApiName: string; Method: string; Resource: string; Stage: string; }): MetricWithDims<{ ApiName: string; Method: string; Resource: string; Stage: string; }>;

  public static countSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApiGateway",
      "metricName": "Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static integrationLatencyAverage(dimensions: { ApiName: string; Stage: string; }): MetricWithDims<{ ApiName: string; Stage: string; }>;

  public static integrationLatencyAverage(dimensions: { ApiName: string; }): MetricWithDims<{ ApiName: string; }>;

  public static integrationLatencyAverage(dimensions: { ApiName: string; Method: string; Resource: string; Stage: string; }): MetricWithDims<{ ApiName: string; Method: string; Resource: string; Stage: string; }>;

  public static integrationLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApiGateway",
      "metricName": "IntegrationLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static latencyAverage(dimensions: { ApiName: string; Stage: string; }): MetricWithDims<{ ApiName: string; Stage: string; }>;

  public static latencyAverage(dimensions: { ApiName: string; }): MetricWithDims<{ ApiName: string; }>;

  public static latencyAverage(dimensions: { ApiName: string; Method: string; Resource: string; Stage: string; }): MetricWithDims<{ ApiName: string; Method: string; Resource: string; Stage: string; }>;

  public static latencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApiGateway",
      "metricName": "Latency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}