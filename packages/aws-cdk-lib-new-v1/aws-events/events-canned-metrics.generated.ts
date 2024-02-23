/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class EventsMetrics {
  public static invocationsSum(dimensions: { RuleName: string; }): MetricWithDims<{ RuleName: string; }> {
    return {
      "namespace": "AWS/Events",
      "metricName": "Invocations",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static failedInvocationsSum(dimensions: { RuleName: string; }): MetricWithDims<{ RuleName: string; }> {
    return {
      "namespace": "AWS/Events",
      "metricName": "FailedInvocations",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static deadLetterInvocationsSum(dimensions: { RuleName: string; }): MetricWithDims<{ RuleName: string; }> {
    return {
      "namespace": "AWS/Events",
      "metricName": "DeadLetterInvocations",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static triggeredRulesSum(dimensions: { RuleName: string; }): MetricWithDims<{ RuleName: string; }> {
    return {
      "namespace": "AWS/Events",
      "metricName": "TriggeredRules",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static matchedEventsSum(dimensions: { RuleName: string; }): MetricWithDims<{ RuleName: string; }> {
    return {
      "namespace": "AWS/Events",
      "metricName": "MatchedEvents",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static throttledRulesSum(dimensions: { RuleName: string; }): MetricWithDims<{ RuleName: string; }> {
    return {
      "namespace": "AWS/Events",
      "metricName": "ThrottledRules",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}