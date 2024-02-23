/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class AppStreamMetrics {
  public static capacityUtilizationAverage(dimensions: { Fleet: string; }): MetricWithDims<{ Fleet: string; }> {
    return {
      "namespace": "AWS/AppStream",
      "metricName": "CapacityUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static insufficientCapacityErrorSum(dimensions: { Fleet: string; }): MetricWithDims<{ Fleet: string; }> {
    return {
      "namespace": "AWS/AppStream",
      "metricName": "InsufficientCapacityError",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static actualCapacityAverage(dimensions: { Fleet: string; }): MetricWithDims<{ Fleet: string; }> {
    return {
      "namespace": "AWS/AppStream",
      "metricName": "ActualCapacity",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static availableCapacityAverage(dimensions: { Fleet: string; }): MetricWithDims<{ Fleet: string; }> {
    return {
      "namespace": "AWS/AppStream",
      "metricName": "AvailableCapacity",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static desiredCapacityAverage(dimensions: { Fleet: string; }): MetricWithDims<{ Fleet: string; }> {
    return {
      "namespace": "AWS/AppStream",
      "metricName": "DesiredCapacity",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static inUseCapacityAverage(dimensions: { Fleet: string; }): MetricWithDims<{ Fleet: string; }> {
    return {
      "namespace": "AWS/AppStream",
      "metricName": "InUseCapacity",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static pendingCapacityAverage(dimensions: { Fleet: string; }): MetricWithDims<{ Fleet: string; }> {
    return {
      "namespace": "AWS/AppStream",
      "metricName": "PendingCapacity",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static runningCapacityAverage(dimensions: { Fleet: string; }): MetricWithDims<{ Fleet: string; }> {
    return {
      "namespace": "AWS/AppStream",
      "metricName": "RunningCapacity",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}