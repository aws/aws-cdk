// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class EventsMetrics {
  public static invocationsSum(dimensions: { RuleName: string }) {
    return {
      namespace: 'AWS/Events',
      metricName: 'Invocations',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static failedInvocationsSum(dimensions: { RuleName: string }) {
    return {
      namespace: 'AWS/Events',
      metricName: 'FailedInvocations',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static deadLetterInvocationsSum(dimensions: { RuleName: string }) {
    return {
      namespace: 'AWS/Events',
      metricName: 'DeadLetterInvocations',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static triggeredRulesSum(dimensions: { RuleName: string }) {
    return {
      namespace: 'AWS/Events',
      metricName: 'TriggeredRules',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static matchedEventsSum(dimensions: { RuleName: string }) {
    return {
      namespace: 'AWS/Events',
      metricName: 'MatchedEvents',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static throttledRulesSum(dimensions: { RuleName: string }) {
    return {
      namespace: 'AWS/Events',
      metricName: 'ThrottledRules',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
