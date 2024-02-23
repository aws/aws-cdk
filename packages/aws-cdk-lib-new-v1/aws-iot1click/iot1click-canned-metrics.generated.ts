/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class IoT1ClickMetrics {
  public static totalEventsSum(dimensions: { DeviceType: string; }): MetricWithDims<{ DeviceType: string; }> {
    return {
      "namespace": "AWS/IoT1Click",
      "metricName": "TotalEvents",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static remainingLifeAverage(dimensions: { DeviceType: string; }): MetricWithDims<{ DeviceType: string; }> {
    return {
      "namespace": "AWS/IoT1Click",
      "metricName": "RemainingLife",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static callbackInvocationErrorsSum(dimensions: { DeviceType: string; }): MetricWithDims<{ DeviceType: string; }> {
    return {
      "namespace": "AWS/IoT1Click",
      "metricName": "CallbackInvocationErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}