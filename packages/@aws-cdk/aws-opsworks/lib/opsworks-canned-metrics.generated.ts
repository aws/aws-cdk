// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class OpsWorksMetrics {
  public static procsAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static procsAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static procsAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static procsAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'procs',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memoryUsedAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static memoryUsedAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static memoryUsedAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static memoryUsedAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'memory_used',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuIdleAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static cpuIdleAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static cpuIdleAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static cpuIdleAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'cpu_idle',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuNiceAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static cpuNiceAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static cpuNiceAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static cpuNiceAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'cpu_nice',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuStealAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static cpuStealAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static cpuStealAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static cpuStealAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'cpu_steal',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuSystemAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static cpuSystemAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static cpuSystemAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static cpuSystemAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'cpu_system',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuUserAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static cpuUserAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static cpuUserAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static cpuUserAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'cpu_user',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuWaitioAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static cpuWaitioAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static cpuWaitioAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static cpuWaitioAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'cpu_waitio',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static load1Average(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static load1Average(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static load1Average(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static load1Average(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'load_1',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static load15Average(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static load15Average(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static load15Average(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static load15Average(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'load_15',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static load5Average(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static load5Average(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static load5Average(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static load5Average(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'load_5',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memoryBuffersAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static memoryBuffersAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static memoryBuffersAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static memoryBuffersAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'memory_buffers',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memoryCachedAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static memoryCachedAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static memoryCachedAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static memoryCachedAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'memory_cached',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memoryFreeAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static memoryFreeAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static memoryFreeAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static memoryFreeAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'memory_free',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memorySwapAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static memorySwapAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static memorySwapAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static memorySwapAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'memory_swap',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memoryTotalAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static memoryTotalAverage(dimensions: { LayerId: string }): MetricWithDims<{ LayerId: string }>;
  public static memoryTotalAverage(dimensions: { StackId: string }): MetricWithDims<{ StackId: string }>;
  public static memoryTotalAverage(dimensions: any) {
    return {
      namespace: 'AWS/OpsWorks',
      metricName: 'memory_total',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
type MetricWithDims<D> = { namespace: string, metricName: string, statistic: string, dimensionsMap: D };
