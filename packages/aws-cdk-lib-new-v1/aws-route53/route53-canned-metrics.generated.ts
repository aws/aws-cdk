/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class Route53Metrics {
  public static healthCheckPercentageHealthyAverage(dimensions: { HealthCheckId: string; }): MetricWithDims<{ HealthCheckId: string; }> {
    return {
      "namespace": "AWS/Route53",
      "metricName": "HealthCheckPercentageHealthy",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static connectionTimeAverage(dimensions: { HealthCheckId: string; }): MetricWithDims<{ HealthCheckId: string; }> {
    return {
      "namespace": "AWS/Route53",
      "metricName": "ConnectionTime",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static healthCheckStatusMinimum(dimensions: { HealthCheckId: string; }): MetricWithDims<{ HealthCheckId: string; }> {
    return {
      "namespace": "AWS/Route53",
      "metricName": "HealthCheckStatus",
      "dimensionsMap": dimensions,
      "statistic": "Minimum"
    };
  }

  public static sslHandshakeTimeAverage(dimensions: { HealthCheckId: string; }): MetricWithDims<{ HealthCheckId: string; }> {
    return {
      "namespace": "AWS/Route53",
      "metricName": "SSLHandshakeTime",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static childHealthCheckHealthyCountAverage(dimensions: { HealthCheckId: string; }): MetricWithDims<{ HealthCheckId: string; }> {
    return {
      "namespace": "AWS/Route53",
      "metricName": "ChildHealthCheckHealthyCount",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static timeToFirstByteAverage(dimensions: { HealthCheckId: string; }): MetricWithDims<{ HealthCheckId: string; }> {
    return {
      "namespace": "AWS/Route53",
      "metricName": "TimeToFirstByte",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}