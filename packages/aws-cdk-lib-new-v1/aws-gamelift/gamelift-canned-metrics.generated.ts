/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class GameLiftMetrics {
  public static activeInstancesAverage(dimensions: { FleetId: string; }): MetricWithDims<{ FleetId: string; }> {
    return {
      "namespace": "AWS/GameLift",
      "metricName": "ActiveInstances",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static percentIdleInstancesAverage(dimensions: { FleetId: string; }): MetricWithDims<{ FleetId: string; }> {
    return {
      "namespace": "AWS/GameLift",
      "metricName": "PercentIdleInstances",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static desiredInstancesAverage(dimensions: { FleetId: string; }): MetricWithDims<{ FleetId: string; }> {
    return {
      "namespace": "AWS/GameLift",
      "metricName": "DesiredInstances",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static idleInstancesAverage(dimensions: { FleetId: string; }): MetricWithDims<{ FleetId: string; }> {
    return {
      "namespace": "AWS/GameLift",
      "metricName": "IdleInstances",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static maxInstancesAverage(dimensions: { FleetId: string; }): MetricWithDims<{ FleetId: string; }> {
    return {
      "namespace": "AWS/GameLift",
      "metricName": "MaxInstances",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static minInstancesAverage(dimensions: { FleetId: string; }): MetricWithDims<{ FleetId: string; }> {
    return {
      "namespace": "AWS/GameLift",
      "metricName": "MinInstances",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static instanceInterruptionsSum(dimensions: { FleetId: string; }): MetricWithDims<{ FleetId: string; }> {
    return {
      "namespace": "AWS/GameLift",
      "metricName": "InstanceInterruptions",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}