// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class DMSMetrics {
  public static cdcLatencyTargetSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'CDCLatencyTarget',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static cdcLatencySourceSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'CDCLatencySource',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static availableMemoryAverage(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'AvailableMemory',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cdcChangesDiskTargetSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'CDCChangesDiskTarget',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static cdcChangesMemorySourceSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'CDCChangesMemorySource',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static cdcChangesMemoryTargetSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'CDCChangesMemoryTarget',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static cdcIncomingChangesSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'CDCIncomingChanges',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static cdcThroughputBandwidthSourceSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'CDCThroughputBandwidthSource',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static cdcThroughputBandwidthTargetSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'CDCThroughputBandwidthTarget',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static cdcThroughputRowsSourceSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'CDCThroughputRowsSource',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static cdcThroughputRowsTargetSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'CDCThroughputRowsTarget',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static cpuAllocatedSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'CPUAllocated',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static cpuUtilizationAverage(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'CPUUtilization',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static freeMemoryAverage(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'FreeMemory',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static fullLoadThroughputBandwidthSourceSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'FullLoadThroughputBandwidthSource',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static fullLoadThroughputBandwidthTargetSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'FullLoadThroughputBandwidthTarget',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static fullLoadThroughputRowsSourceSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'FullLoadThroughputRowsSource',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static fullLoadThroughputRowsTargetSum(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'FullLoadThroughputRowsTarget',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static memoryAllocatedAverage(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'MemoryAllocated',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memoryUsageAverage(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'MemoryUsage',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static swapUsageAverage(dimensions: { ReplicationInstanceIdentifier: string }) {
    return {
      namespace: 'AWS/DMS',
      metricName: 'SwapUsage',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
