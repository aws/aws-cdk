// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class ElasticBeanstalkMetrics {
  public static environmentHealthAverage(dimensions: { EnvironmentName: string }) {
    return {
      namespace: 'AWS/ElasticBeanstalk',
      metricName: 'EnvironmentHealth',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static applicationRequests5XxAverage(dimensions: { EnvironmentName: string }) {
    return {
      namespace: 'AWS/ElasticBeanstalk',
      metricName: 'ApplicationRequests5xx',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static applicationRequests2XxAverage(dimensions: { EnvironmentName: string }) {
    return {
      namespace: 'AWS/ElasticBeanstalk',
      metricName: 'ApplicationRequests2xx',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static applicationRequests3XxAverage(dimensions: { EnvironmentName: string }) {
    return {
      namespace: 'AWS/ElasticBeanstalk',
      metricName: 'ApplicationRequests3xx',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static applicationRequests4XxAverage(dimensions: { EnvironmentName: string }) {
    return {
      namespace: 'AWS/ElasticBeanstalk',
      metricName: 'ApplicationRequests4xx',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
