/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class ELBMetrics {
  public static backendConnectionErrorsSum(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static backendConnectionErrorsSum(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static backendConnectionErrorsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "BackendConnectionErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static desyncMitigationModeNonCompliantRequestCountSum(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static desyncMitigationModeNonCompliantRequestCountSum(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static desyncMitigationModeNonCompliantRequestCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "DesyncMitigationMode_NonCompliant_Request_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeBackend2XxSum(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static httpCodeBackend2XxSum(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static httpCodeBackend2XxSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "HTTPCode_Backend_2XX",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeBackend3XxSum(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static httpCodeBackend3XxSum(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static httpCodeBackend3XxSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "HTTPCode_Backend_3XX",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeBackend4XxSum(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static httpCodeBackend4XxSum(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static httpCodeBackend4XxSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "HTTPCode_Backend_4XX",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeBackend5XxSum(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static httpCodeBackend5XxSum(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static httpCodeBackend5XxSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "HTTPCode_Backend_5XX",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeElb4XxSum(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static httpCodeElb4XxSum(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static httpCodeElb4XxSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "HTTPCode_ELB_4XX",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeElb5XxSum(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static httpCodeElb5XxSum(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static httpCodeElb5XxSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "HTTPCode_ELB_5XX",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static healthyHostCountAverage(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static healthyHostCountAverage(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static healthyHostCountAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "HealthyHostCount",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static latencyAverage(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static latencyAverage(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static latencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "Latency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static requestCountSum(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static requestCountSum(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static requestCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "RequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static spilloverCountSum(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static spilloverCountSum(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static spilloverCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "SpilloverCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static surgeQueueLengthAverage(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static surgeQueueLengthAverage(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static surgeQueueLengthAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "SurgeQueueLength",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static unHealthyHostCountAverage(dimensions: { LoadBalancerName: string; }): MetricWithDims<{ LoadBalancerName: string; }>;

  public static unHealthyHostCountAverage(dimensions: { AvailabilityZone: string; LoadBalancerName: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancerName: string; }>;

  public static unHealthyHostCountAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ELB",
      "metricName": "UnHealthyHostCount",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}