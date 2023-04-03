// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class CognitoMetrics {
  public static noRiskSum(dimensions: { Operation: string, UserPoolId: string }) {
    return {
      namespace: 'AWS/Cognito',
      metricName: 'NoRisk',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static riskSum(dimensions: { Operation: string, UserPoolId: string }) {
    return {
      namespace: 'AWS/Cognito',
      metricName: 'Risk',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
