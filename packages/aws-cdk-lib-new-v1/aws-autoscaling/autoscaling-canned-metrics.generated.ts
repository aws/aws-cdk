/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class AutoScalingMetrics {
  public static groupTotalInstancesAverage(dimensions: { AutoScalingGroupName: string; }): MetricWithDims<{ AutoScalingGroupName: string; }> {
    return {
      "namespace": "AWS/AutoScaling",
      "metricName": "GroupTotalInstances",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static groupDesiredCapacityAverage(dimensions: { AutoScalingGroupName: string; }): MetricWithDims<{ AutoScalingGroupName: string; }> {
    return {
      "namespace": "AWS/AutoScaling",
      "metricName": "GroupDesiredCapacity",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static groupMaxSizeAverage(dimensions: { AutoScalingGroupName: string; }): MetricWithDims<{ AutoScalingGroupName: string; }> {
    return {
      "namespace": "AWS/AutoScaling",
      "metricName": "GroupMaxSize",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static groupMinSizeAverage(dimensions: { AutoScalingGroupName: string; }): MetricWithDims<{ AutoScalingGroupName: string; }> {
    return {
      "namespace": "AWS/AutoScaling",
      "metricName": "GroupMinSize",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static groupTerminatingInstancesAverage(dimensions: { AutoScalingGroupName: string; }): MetricWithDims<{ AutoScalingGroupName: string; }> {
    return {
      "namespace": "AWS/AutoScaling",
      "metricName": "GroupTerminatingInstances",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static groupPendingInstancesAverage(dimensions: { AutoScalingGroupName: string; }): MetricWithDims<{ AutoScalingGroupName: string; }> {
    return {
      "namespace": "AWS/AutoScaling",
      "metricName": "GroupPendingInstances",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static groupInServiceInstancesAverage(dimensions: { AutoScalingGroupName: string; }): MetricWithDims<{ AutoScalingGroupName: string; }> {
    return {
      "namespace": "AWS/AutoScaling",
      "metricName": "GroupInServiceInstances",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static groupStandbyInstancesAverage(dimensions: { AutoScalingGroupName: string; }): MetricWithDims<{ AutoScalingGroupName: string; }> {
    return {
      "namespace": "AWS/AutoScaling",
      "metricName": "GroupStandbyInstances",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}