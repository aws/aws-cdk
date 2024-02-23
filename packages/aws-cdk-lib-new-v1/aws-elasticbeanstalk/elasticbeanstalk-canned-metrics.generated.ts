/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class ElasticBeanstalkMetrics {
  public static environmentHealthAverage(dimensions: { EnvironmentName: string; }): MetricWithDims<{ EnvironmentName: string; }> {
    return {
      "namespace": "AWS/ElasticBeanstalk",
      "metricName": "EnvironmentHealth",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static applicationRequests5XxAverage(dimensions: { EnvironmentName: string; }): MetricWithDims<{ EnvironmentName: string; }> {
    return {
      "namespace": "AWS/ElasticBeanstalk",
      "metricName": "ApplicationRequests5xx",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static applicationRequests2XxAverage(dimensions: { EnvironmentName: string; }): MetricWithDims<{ EnvironmentName: string; }> {
    return {
      "namespace": "AWS/ElasticBeanstalk",
      "metricName": "ApplicationRequests2xx",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static applicationRequests3XxAverage(dimensions: { EnvironmentName: string; }): MetricWithDims<{ EnvironmentName: string; }> {
    return {
      "namespace": "AWS/ElasticBeanstalk",
      "metricName": "ApplicationRequests3xx",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static applicationRequests4XxAverage(dimensions: { EnvironmentName: string; }): MetricWithDims<{ EnvironmentName: string; }> {
    return {
      "namespace": "AWS/ElasticBeanstalk",
      "metricName": "ApplicationRequests4xx",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}