/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class CodeBuildMetrics {
  public static succeededBuildsSum(dimensions: { ProjectName: string; }): MetricWithDims<{ ProjectName: string; }> {
    return {
      "namespace": "AWS/CodeBuild",
      "metricName": "SucceededBuilds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static failedBuildsSum(dimensions: { ProjectName: string; }): MetricWithDims<{ ProjectName: string; }> {
    return {
      "namespace": "AWS/CodeBuild",
      "metricName": "FailedBuilds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static buildsSum(dimensions: { ProjectName: string; }): MetricWithDims<{ ProjectName: string; }> {
    return {
      "namespace": "AWS/CodeBuild",
      "metricName": "Builds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static durationAverage(dimensions: { ProjectName: string; }): MetricWithDims<{ ProjectName: string; }> {
    return {
      "namespace": "AWS/CodeBuild",
      "metricName": "Duration",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}