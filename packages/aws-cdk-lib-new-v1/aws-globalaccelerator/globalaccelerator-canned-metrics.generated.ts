/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class GlobalAcceleratorMetrics {
  public static newFlowCountSum(dimensions: { Accelerator: string; }): MetricWithDims<{ Accelerator: string; }> {
    return {
      "namespace": "AWS/GlobalAccelerator",
      "metricName": "NewFlowCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static processedBytesInSum(dimensions: { Accelerator: string; }): MetricWithDims<{ Accelerator: string; }> {
    return {
      "namespace": "AWS/GlobalAccelerator",
      "metricName": "ProcessedBytesIn",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static processedBytesOutSum(dimensions: { Accelerator: string; }): MetricWithDims<{ Accelerator: string; }> {
    return {
      "namespace": "AWS/GlobalAccelerator",
      "metricName": "ProcessedBytesOut",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}