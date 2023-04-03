// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class ECSMetrics {
  public static cpuUtilizationAverage(dimensions: { ClusterName: string, ServiceName: string }): MetricWithDims<{ ClusterName: string, ServiceName: string }>;
  public static cpuUtilizationAverage(dimensions: { ClusterName: string }): MetricWithDims<{ ClusterName: string }>;
  public static cpuUtilizationAverage(dimensions: any) {
    return {
      namespace: 'AWS/ECS',
      metricName: 'CPUUtilization',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memoryUtilizationAverage(dimensions: { ClusterName: string, ServiceName: string }): MetricWithDims<{ ClusterName: string, ServiceName: string }>;
  public static memoryUtilizationAverage(dimensions: { ClusterName: string }): MetricWithDims<{ ClusterName: string }>;
  public static memoryUtilizationAverage(dimensions: any) {
    return {
      namespace: 'AWS/ECS',
      metricName: 'MemoryUtilization',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuReservationAverage(dimensions: { ClusterName: string }) {
    return {
      namespace: 'AWS/ECS',
      metricName: 'CPUReservation',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memoryReservationAverage(dimensions: { ClusterName: string }) {
    return {
      namespace: 'AWS/ECS',
      metricName: 'MemoryReservation',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static gpuReservationAverage(dimensions: { ClusterName: string }) {
    return {
      namespace: 'AWS/ECS',
      metricName: 'GPUReservation',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
type MetricWithDims<D> = { namespace: string, metricName: string, statistic: string, dimensionsMap: D };
