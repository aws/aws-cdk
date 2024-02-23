/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class ECSMetrics {
  public static cpuUtilizationAverage(dimensions: { ClusterName: string; ServiceName: string; }): MetricWithDims<{ ClusterName: string; ServiceName: string; }>;

  public static cpuUtilizationAverage(dimensions: { ClusterName: string; }): MetricWithDims<{ ClusterName: string; }>;

  public static cpuUtilizationAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ECS",
      "metricName": "CPUUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static memoryUtilizationAverage(dimensions: { ClusterName: string; ServiceName: string; }): MetricWithDims<{ ClusterName: string; ServiceName: string; }>;

  public static memoryUtilizationAverage(dimensions: { ClusterName: string; }): MetricWithDims<{ ClusterName: string; }>;

  public static memoryUtilizationAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ECS",
      "metricName": "MemoryUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static cpuReservationAverage(dimensions: { ClusterName: string; }): MetricWithDims<{ ClusterName: string; }> {
    return {
      "namespace": "AWS/ECS",
      "metricName": "CPUReservation",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static memoryReservationAverage(dimensions: { ClusterName: string; }): MetricWithDims<{ ClusterName: string; }> {
    return {
      "namespace": "AWS/ECS",
      "metricName": "MemoryReservation",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static gpuReservationAverage(dimensions: { ClusterName: string; }): MetricWithDims<{ ClusterName: string; }> {
    return {
      "namespace": "AWS/ECS",
      "metricName": "GPUReservation",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}