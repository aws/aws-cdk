// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class CodeBuildMetrics {
  public static succeededBuildsSum(dimensions: { ProjectName: string }) {
    return {
      namespace: 'AWS/CodeBuild',
      metricName: 'SucceededBuilds',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static failedBuildsSum(dimensions: { ProjectName: string }) {
    return {
      namespace: 'AWS/CodeBuild',
      metricName: 'FailedBuilds',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static buildsSum(dimensions: { ProjectName: string }) {
    return {
      namespace: 'AWS/CodeBuild',
      metricName: 'Builds',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static durationAverage(dimensions: { ProjectName: string }) {
    return {
      namespace: 'AWS/CodeBuild',
      metricName: 'Duration',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
