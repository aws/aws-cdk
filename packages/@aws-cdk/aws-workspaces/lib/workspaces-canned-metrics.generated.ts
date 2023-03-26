// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class WorkSpacesMetrics {
  public static availableAverage(dimensions: { WorkspaceId: string }) {
    return {
      namespace: 'AWS/WorkSpaces',
      metricName: 'Available',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static unhealthyAverage(dimensions: { WorkspaceId: string }) {
    return {
      namespace: 'AWS/WorkSpaces',
      metricName: 'Unhealthy',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static sessionLaunchTimeAverage(dimensions: { WorkspaceId: string }) {
    return {
      namespace: 'AWS/WorkSpaces',
      metricName: 'SessionLaunchTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static connectionSuccessSum(dimensions: { WorkspaceId: string }) {
    return {
      namespace: 'AWS/WorkSpaces',
      metricName: 'ConnectionSuccess',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static connectionFailureSum(dimensions: { WorkspaceId: string }) {
    return {
      namespace: 'AWS/WorkSpaces',
      metricName: 'ConnectionFailure',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static connectionAttemptSum(dimensions: { WorkspaceId: string }) {
    return {
      namespace: 'AWS/WorkSpaces',
      metricName: 'ConnectionAttempt',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static inSessionLatencyAverage(dimensions: { WorkspaceId: string }) {
    return {
      namespace: 'AWS/WorkSpaces',
      metricName: 'InSessionLatency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static sessionDisconnectSum(dimensions: { WorkspaceId: string }) {
    return {
      namespace: 'AWS/WorkSpaces',
      metricName: 'SessionDisconnect',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static userConnectedSum(dimensions: { WorkspaceId: string }) {
    return {
      namespace: 'AWS/WorkSpaces',
      metricName: 'UserConnected',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static stoppedSum(dimensions: { WorkspaceId: string }) {
    return {
      namespace: 'AWS/WorkSpaces',
      metricName: 'Stopped',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static maintenanceSum(dimensions: { WorkspaceId: string }) {
    return {
      namespace: 'AWS/WorkSpaces',
      metricName: 'Maintenance',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
