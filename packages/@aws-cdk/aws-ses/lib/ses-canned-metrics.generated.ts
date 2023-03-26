// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class SESMetrics {
  public static bounceSum(dimensions: { RuleName: string }): MetricWithDims<{ RuleName: string }>;
  public static bounceSum(dimensions: { 'ses:configuration-set': string }): MetricWithDims<{ 'ses:configuration-set': string }>;
  public static bounceSum(dimensions: any) {
    return {
      namespace: 'AWS/SES',
      metricName: 'Bounce',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static clickSum(dimensions: { RuleName: string }): MetricWithDims<{ RuleName: string }>;
  public static clickSum(dimensions: { 'ses:configuration-set': string }): MetricWithDims<{ 'ses:configuration-set': string }>;
  public static clickSum(dimensions: any) {
    return {
      namespace: 'AWS/SES',
      metricName: 'Click',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static complaintSum(dimensions: { RuleName: string }): MetricWithDims<{ RuleName: string }>;
  public static complaintSum(dimensions: { 'ses:configuration-set': string }): MetricWithDims<{ 'ses:configuration-set': string }>;
  public static complaintSum(dimensions: any) {
    return {
      namespace: 'AWS/SES',
      metricName: 'Complaint',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static deliverySum(dimensions: { RuleName: string }): MetricWithDims<{ RuleName: string }>;
  public static deliverySum(dimensions: { 'ses:configuration-set': string }): MetricWithDims<{ 'ses:configuration-set': string }>;
  public static deliverySum(dimensions: any) {
    return {
      namespace: 'AWS/SES',
      metricName: 'Delivery',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static openSum(dimensions: { RuleName: string }): MetricWithDims<{ RuleName: string }>;
  public static openSum(dimensions: { 'ses:configuration-set': string }): MetricWithDims<{ 'ses:configuration-set': string }>;
  public static openSum(dimensions: any) {
    return {
      namespace: 'AWS/SES',
      metricName: 'Open',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static rejectSum(dimensions: { RuleName: string }): MetricWithDims<{ RuleName: string }>;
  public static rejectSum(dimensions: { 'ses:configuration-set': string }): MetricWithDims<{ 'ses:configuration-set': string }>;
  public static rejectSum(dimensions: any) {
    return {
      namespace: 'AWS/SES',
      metricName: 'Reject',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static renderingFailureSum(dimensions: { RuleName: string }): MetricWithDims<{ RuleName: string }>;
  public static renderingFailureSum(dimensions: { 'ses:configuration-set': string }): MetricWithDims<{ 'ses:configuration-set': string }>;
  public static renderingFailureSum(dimensions: any) {
    return {
      namespace: 'AWS/SES',
      metricName: 'RenderingFailure',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static reputationBounceRateAverage(dimensions: { RuleName: string }): MetricWithDims<{ RuleName: string }>;
  public static reputationBounceRateAverage(dimensions: { 'ses:configuration-set': string }): MetricWithDims<{ 'ses:configuration-set': string }>;
  public static reputationBounceRateAverage(dimensions: any) {
    return {
      namespace: 'AWS/SES',
      metricName: 'Reputation.BounceRate',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static reputationComplaintRateAverage(dimensions: { RuleName: string }): MetricWithDims<{ RuleName: string }>;
  public static reputationComplaintRateAverage(dimensions: { 'ses:configuration-set': string }): MetricWithDims<{ 'ses:configuration-set': string }>;
  public static reputationComplaintRateAverage(dimensions: any) {
    return {
      namespace: 'AWS/SES',
      metricName: 'Reputation.ComplaintRate',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static sendSum(dimensions: { RuleName: string }): MetricWithDims<{ RuleName: string }>;
  public static sendSum(dimensions: { 'ses:configuration-set': string }): MetricWithDims<{ 'ses:configuration-set': string }>;
  public static sendSum(dimensions: any) {
    return {
      namespace: 'AWS/SES',
      metricName: 'Send',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
type MetricWithDims<D> = { namespace: string, metricName: string, statistic: string, dimensionsMap: D };
