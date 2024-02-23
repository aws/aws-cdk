/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class CognitoMetrics {
  public static noRiskSum(dimensions: { Operation: string; UserPoolId: string; }): MetricWithDims<{ Operation: string; UserPoolId: string; }> {
    return {
      "namespace": "AWS/Cognito",
      "metricName": "NoRisk",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static riskSum(dimensions: { Operation: string; UserPoolId: string; }): MetricWithDims<{ Operation: string; UserPoolId: string; }> {
    return {
      "namespace": "AWS/Cognito",
      "metricName": "Risk",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}