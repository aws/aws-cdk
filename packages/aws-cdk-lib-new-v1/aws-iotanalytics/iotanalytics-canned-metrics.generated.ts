/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class IoTAnalyticsMetrics {
  public static incomingMessagesSum(dimensions: { ChannelName: string; }): MetricWithDims<{ ChannelName: string; }>;

  public static incomingMessagesSum(dimensions: { DatasetName: string; }): MetricWithDims<{ DatasetName: string; }>;

  public static incomingMessagesSum(dimensions: { DatastoreName: string; }): MetricWithDims<{ DatastoreName: string; }>;

  public static incomingMessagesSum(dimensions: { PipelineActivityName: string; }): MetricWithDims<{ PipelineActivityName: string; }>;

  public static incomingMessagesSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/IoTAnalytics",
      "metricName": "IncomingMessages",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static actionExecutionSum(dimensions: { DatasetName: string; }): MetricWithDims<{ DatasetName: string; }>;

  public static actionExecutionSum(dimensions: { DatastoreName: string; }): MetricWithDims<{ DatastoreName: string; }>;

  public static actionExecutionSum(dimensions: { PipelineActivityName: string; }): MetricWithDims<{ PipelineActivityName: string; }>;

  public static actionExecutionSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/IoTAnalytics",
      "metricName": "ActionExecution",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static actionExecutionThrottledSum(dimensions: { DatasetName: string; }): MetricWithDims<{ DatasetName: string; }>;

  public static actionExecutionThrottledSum(dimensions: { DatastoreName: string; }): MetricWithDims<{ DatastoreName: string; }>;

  public static actionExecutionThrottledSum(dimensions: { PipelineActivityName: string; }): MetricWithDims<{ PipelineActivityName: string; }>;

  public static actionExecutionThrottledSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/IoTAnalytics",
      "metricName": "ActionExecutionThrottled",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static activityExecutionErrorSum(dimensions: { DatasetName: string; }): MetricWithDims<{ DatasetName: string; }>;

  public static activityExecutionErrorSum(dimensions: { DatastoreName: string; }): MetricWithDims<{ DatastoreName: string; }>;

  public static activityExecutionErrorSum(dimensions: { PipelineActivityName: string; }): MetricWithDims<{ PipelineActivityName: string; }>;

  public static activityExecutionErrorSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/IoTAnalytics",
      "metricName": "ActivityExecutionError",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static pipelineConcurrentExecutionCountSum(dimensions: { DatasetName: string; }): MetricWithDims<{ DatasetName: string; }>;

  public static pipelineConcurrentExecutionCountSum(dimensions: { DatastoreName: string; }): MetricWithDims<{ DatastoreName: string; }>;

  public static pipelineConcurrentExecutionCountSum(dimensions: { PipelineActivityName: string; }): MetricWithDims<{ PipelineActivityName: string; }>;

  public static pipelineConcurrentExecutionCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/IoTAnalytics",
      "metricName": "PipelineConcurrentExecutionCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}