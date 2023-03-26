// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class IoTAnalyticsMetrics {
  public static incomingMessagesSum(dimensions: { ChannelName: string }): MetricWithDims<{ ChannelName: string }>;
  public static incomingMessagesSum(dimensions: { DatasetName: string }): MetricWithDims<{ DatasetName: string }>;
  public static incomingMessagesSum(dimensions: { DatastoreName: string }): MetricWithDims<{ DatastoreName: string }>;
  public static incomingMessagesSum(dimensions: { PipelineActivityName: string }): MetricWithDims<{ PipelineActivityName: string }>;
  public static incomingMessagesSum(dimensions: any) {
    return {
      namespace: 'AWS/IoTAnalytics',
      metricName: 'IncomingMessages',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static actionExecutionSum(dimensions: { DatasetName: string }): MetricWithDims<{ DatasetName: string }>;
  public static actionExecutionSum(dimensions: { DatastoreName: string }): MetricWithDims<{ DatastoreName: string }>;
  public static actionExecutionSum(dimensions: { PipelineActivityName: string }): MetricWithDims<{ PipelineActivityName: string }>;
  public static actionExecutionSum(dimensions: any) {
    return {
      namespace: 'AWS/IoTAnalytics',
      metricName: 'ActionExecution',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static actionExecutionThrottledSum(dimensions: { DatasetName: string }): MetricWithDims<{ DatasetName: string }>;
  public static actionExecutionThrottledSum(dimensions: { DatastoreName: string }): MetricWithDims<{ DatastoreName: string }>;
  public static actionExecutionThrottledSum(dimensions: { PipelineActivityName: string }): MetricWithDims<{ PipelineActivityName: string }>;
  public static actionExecutionThrottledSum(dimensions: any) {
    return {
      namespace: 'AWS/IoTAnalytics',
      metricName: 'ActionExecutionThrottled',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static activityExecutionErrorSum(dimensions: { DatasetName: string }): MetricWithDims<{ DatasetName: string }>;
  public static activityExecutionErrorSum(dimensions: { DatastoreName: string }): MetricWithDims<{ DatastoreName: string }>;
  public static activityExecutionErrorSum(dimensions: { PipelineActivityName: string }): MetricWithDims<{ PipelineActivityName: string }>;
  public static activityExecutionErrorSum(dimensions: any) {
    return {
      namespace: 'AWS/IoTAnalytics',
      metricName: 'ActivityExecutionError',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static pipelineConcurrentExecutionCountSum(dimensions: { DatasetName: string }): MetricWithDims<{ DatasetName: string }>;
  public static pipelineConcurrentExecutionCountSum(dimensions: { DatastoreName: string }): MetricWithDims<{ DatastoreName: string }>;
  public static pipelineConcurrentExecutionCountSum(dimensions: { PipelineActivityName: string }): MetricWithDims<{ PipelineActivityName: string }>;
  public static pipelineConcurrentExecutionCountSum(dimensions: any) {
    return {
      namespace: 'AWS/IoTAnalytics',
      metricName: 'PipelineConcurrentExecutionCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
type MetricWithDims<D> = { namespace: string, metricName: string, statistic: string, dimensionsMap: D };
