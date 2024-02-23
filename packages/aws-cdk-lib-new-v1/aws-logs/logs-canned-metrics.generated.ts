/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class LogsMetrics {
  public static incomingLogEventsSum(dimensions: { LogGroupName: string; }): MetricWithDims<{ LogGroupName: string; }> {
    return {
      "namespace": "AWS/Logs",
      "metricName": "IncomingLogEvents",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static incomingBytesSum(dimensions: { LogGroupName: string; }): MetricWithDims<{ LogGroupName: string; }> {
    return {
      "namespace": "AWS/Logs",
      "metricName": "IncomingBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}