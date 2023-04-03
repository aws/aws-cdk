// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class StatesMetrics {
  public static executionTimeAverage(dimensions: { StateMachineArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ExecutionTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static executionsFailedSum(dimensions: { StateMachineArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ExecutionsFailed',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static executionsSucceededSum(dimensions: { StateMachineArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ExecutionsSucceeded',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static executionsThrottledSum(dimensions: { StateMachineArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ExecutionsThrottled',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static executionsAbortedSum(dimensions: { StateMachineArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ExecutionsAborted',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static executionsTimedOutSum(dimensions: { StateMachineArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ExecutionsTimedOut',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static activityTimeAverage(dimensions: { ActivityArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ActivityTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static activitiesSucceededSum(dimensions: { ActivityArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ActivitiesSucceeded',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static activitiesFailedSum(dimensions: { ActivityArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ActivitiesFailed',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static activitiesHeartbeatTimedOutSum(dimensions: { ActivityArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ActivitiesHeartbeatTimedOut',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static activitiesScheduledSum(dimensions: { ActivityArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ActivitiesScheduled',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static activitiesStartedSum(dimensions: { ActivityArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ActivitiesStarted',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static activitiesTimedOutSum(dimensions: { ActivityArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ActivitiesTimedOut',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static activityRunTimeAverage(dimensions: { ActivityArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ActivityRunTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static activityScheduleTimeAverage(dimensions: { ActivityArn: string }) {
    return {
      namespace: 'AWS/States',
      metricName: 'ActivityScheduleTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
