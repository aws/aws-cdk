// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class InspectorMetrics {
  public static totalHealthyAgentsAverage(dimensions: { AssessmentTemplateArn: string, AssessmentTemplateName: string }) {
    return {
      namespace: 'AWS/Inspector',
      metricName: 'TotalHealthyAgents',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static totalAssessmentRunsAverage(dimensions: { AssessmentTemplateArn: string, AssessmentTemplateName: string }) {
    return {
      namespace: 'AWS/Inspector',
      metricName: 'TotalAssessmentRuns',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static totalMatchingAgentsAverage(dimensions: { AssessmentTemplateArn: string, AssessmentTemplateName: string }) {
    return {
      namespace: 'AWS/Inspector',
      metricName: 'TotalMatchingAgents',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static totalFindingsAverage(dimensions: { AssessmentTemplateArn: string, AssessmentTemplateName: string }) {
    return {
      namespace: 'AWS/Inspector',
      metricName: 'TotalFindings',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
