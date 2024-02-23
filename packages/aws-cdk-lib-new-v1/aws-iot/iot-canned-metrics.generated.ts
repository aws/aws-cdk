/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class IoTMetrics {
  public static topicMatchSum(dimensions: { RuleName: string; }): MetricWithDims<{ RuleName: string; }> {
    return {
      "namespace": "AWS/IoT",
      "metricName": "TopicMatch",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static parseErrorSum(dimensions: { RuleName: string; }): MetricWithDims<{ RuleName: string; }> {
    return {
      "namespace": "AWS/IoT",
      "metricName": "ParseError",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static ruleMessageThrottledSum(dimensions: { RuleName: string; }): MetricWithDims<{ RuleName: string; }> {
    return {
      "namespace": "AWS/IoT",
      "metricName": "RuleMessageThrottled",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static ruleNotFoundSum(dimensions: { RuleName: string; }): MetricWithDims<{ RuleName: string; }> {
    return {
      "namespace": "AWS/IoT",
      "metricName": "RuleNotFound",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}