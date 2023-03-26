// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class AutoScalingMetrics {
  public static groupTotalInstancesAverage(dimensions: { AutoScalingGroupName: string }) {
    return {
      namespace: 'AWS/AutoScaling',
      metricName: 'GroupTotalInstances',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static groupDesiredCapacityAverage(dimensions: { AutoScalingGroupName: string }) {
    return {
      namespace: 'AWS/AutoScaling',
      metricName: 'GroupDesiredCapacity',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static groupMaxSizeAverage(dimensions: { AutoScalingGroupName: string }) {
    return {
      namespace: 'AWS/AutoScaling',
      metricName: 'GroupMaxSize',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static groupMinSizeAverage(dimensions: { AutoScalingGroupName: string }) {
    return {
      namespace: 'AWS/AutoScaling',
      metricName: 'GroupMinSize',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static groupTerminatingInstancesAverage(dimensions: { AutoScalingGroupName: string }) {
    return {
      namespace: 'AWS/AutoScaling',
      metricName: 'GroupTerminatingInstances',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static groupPendingInstancesAverage(dimensions: { AutoScalingGroupName: string }) {
    return {
      namespace: 'AWS/AutoScaling',
      metricName: 'GroupPendingInstances',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static groupInServiceInstancesAverage(dimensions: { AutoScalingGroupName: string }) {
    return {
      namespace: 'AWS/AutoScaling',
      metricName: 'GroupInServiceInstances',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static groupStandbyInstancesAverage(dimensions: { AutoScalingGroupName: string }) {
    return {
      namespace: 'AWS/AutoScaling',
      metricName: 'GroupStandbyInstances',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
