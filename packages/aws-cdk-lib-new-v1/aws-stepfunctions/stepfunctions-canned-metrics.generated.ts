/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class StatesMetrics {
  public static executionTimeAverage(dimensions: { StateMachineArn: string; }): MetricWithDims<{ StateMachineArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ExecutionTime",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static executionsFailedSum(dimensions: { StateMachineArn: string; }): MetricWithDims<{ StateMachineArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ExecutionsFailed",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static executionsSucceededSum(dimensions: { StateMachineArn: string; }): MetricWithDims<{ StateMachineArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ExecutionsSucceeded",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static executionsThrottledSum(dimensions: { StateMachineArn: string; }): MetricWithDims<{ StateMachineArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ExecutionsThrottled",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static executionsAbortedSum(dimensions: { StateMachineArn: string; }): MetricWithDims<{ StateMachineArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ExecutionsAborted",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static executionsTimedOutSum(dimensions: { StateMachineArn: string; }): MetricWithDims<{ StateMachineArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ExecutionsTimedOut",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static activityTimeAverage(dimensions: { ActivityArn: string; }): MetricWithDims<{ ActivityArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ActivityTime",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static activitiesSucceededSum(dimensions: { ActivityArn: string; }): MetricWithDims<{ ActivityArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ActivitiesSucceeded",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static activitiesFailedSum(dimensions: { ActivityArn: string; }): MetricWithDims<{ ActivityArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ActivitiesFailed",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static activitiesHeartbeatTimedOutSum(dimensions: { ActivityArn: string; }): MetricWithDims<{ ActivityArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ActivitiesHeartbeatTimedOut",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static activitiesScheduledSum(dimensions: { ActivityArn: string; }): MetricWithDims<{ ActivityArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ActivitiesScheduled",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static activitiesStartedSum(dimensions: { ActivityArn: string; }): MetricWithDims<{ ActivityArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ActivitiesStarted",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static activitiesTimedOutSum(dimensions: { ActivityArn: string; }): MetricWithDims<{ ActivityArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ActivitiesTimedOut",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static activityRunTimeAverage(dimensions: { ActivityArn: string; }): MetricWithDims<{ ActivityArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ActivityRunTime",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static activityScheduleTimeAverage(dimensions: { ActivityArn: string; }): MetricWithDims<{ ActivityArn: string; }> {
    return {
      "namespace": "AWS/States",
      "metricName": "ActivityScheduleTime",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}