/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class WorkSpacesMetrics {
  public static availableAverage(dimensions: { WorkspaceId: string; }): MetricWithDims<{ WorkspaceId: string; }> {
    return {
      "namespace": "AWS/WorkSpaces",
      "metricName": "Available",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static unhealthyAverage(dimensions: { WorkspaceId: string; }): MetricWithDims<{ WorkspaceId: string; }> {
    return {
      "namespace": "AWS/WorkSpaces",
      "metricName": "Unhealthy",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static sessionLaunchTimeAverage(dimensions: { WorkspaceId: string; }): MetricWithDims<{ WorkspaceId: string; }> {
    return {
      "namespace": "AWS/WorkSpaces",
      "metricName": "SessionLaunchTime",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static connectionSuccessSum(dimensions: { WorkspaceId: string; }): MetricWithDims<{ WorkspaceId: string; }> {
    return {
      "namespace": "AWS/WorkSpaces",
      "metricName": "ConnectionSuccess",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static connectionFailureSum(dimensions: { WorkspaceId: string; }): MetricWithDims<{ WorkspaceId: string; }> {
    return {
      "namespace": "AWS/WorkSpaces",
      "metricName": "ConnectionFailure",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static connectionAttemptSum(dimensions: { WorkspaceId: string; }): MetricWithDims<{ WorkspaceId: string; }> {
    return {
      "namespace": "AWS/WorkSpaces",
      "metricName": "ConnectionAttempt",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static inSessionLatencyAverage(dimensions: { WorkspaceId: string; }): MetricWithDims<{ WorkspaceId: string; }> {
    return {
      "namespace": "AWS/WorkSpaces",
      "metricName": "InSessionLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static sessionDisconnectSum(dimensions: { WorkspaceId: string; }): MetricWithDims<{ WorkspaceId: string; }> {
    return {
      "namespace": "AWS/WorkSpaces",
      "metricName": "SessionDisconnect",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static userConnectedSum(dimensions: { WorkspaceId: string; }): MetricWithDims<{ WorkspaceId: string; }> {
    return {
      "namespace": "AWS/WorkSpaces",
      "metricName": "UserConnected",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static stoppedSum(dimensions: { WorkspaceId: string; }): MetricWithDims<{ WorkspaceId: string; }> {
    return {
      "namespace": "AWS/WorkSpaces",
      "metricName": "Stopped",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static maintenanceSum(dimensions: { WorkspaceId: string; }): MetricWithDims<{ WorkspaceId: string; }> {
    return {
      "namespace": "AWS/WorkSpaces",
      "metricName": "Maintenance",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}