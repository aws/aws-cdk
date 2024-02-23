/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class LexMetrics {
  public static runtimeRequestCountSum(dimensions: { BotAlias: string; BotName: string; Operation: string; }): MetricWithDims<{ BotAlias: string; BotName: string; Operation: string; }> {
    return {
      "namespace": "AWS/Lex",
      "metricName": "RuntimeRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static runtimeSuccessfulRequestLatencyAverage(dimensions: { BotAlias: string; BotName: string; Operation: string; }): MetricWithDims<{ BotAlias: string; BotName: string; Operation: string; }> {
    return {
      "namespace": "AWS/Lex",
      "metricName": "RuntimeSuccessfulRequestLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static runtimeInvalidLambdaResponsesSum(dimensions: { BotAlias: string; BotName: string; Operation: string; }): MetricWithDims<{ BotAlias: string; BotName: string; Operation: string; }> {
    return {
      "namespace": "AWS/Lex",
      "metricName": "RuntimeInvalidLambdaResponses",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static runtimeLambdaErrorsSum(dimensions: { BotAlias: string; BotName: string; Operation: string; }): MetricWithDims<{ BotAlias: string; BotName: string; Operation: string; }> {
    return {
      "namespace": "AWS/Lex",
      "metricName": "RuntimeLambdaErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static missedUtteranceCountSum(dimensions: { BotAlias: string; BotName: string; Operation: string; }): MetricWithDims<{ BotAlias: string; BotName: string; Operation: string; }> {
    return {
      "namespace": "AWS/Lex",
      "metricName": "MissedUtteranceCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static runtimePollyErrorsSum(dimensions: { BotAlias: string; BotName: string; Operation: string; }): MetricWithDims<{ BotAlias: string; BotName: string; Operation: string; }> {
    return {
      "namespace": "AWS/Lex",
      "metricName": "RuntimePollyErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static runtimeSystemErrorsSum(dimensions: { BotAlias: string; BotName: string; Operation: string; }): MetricWithDims<{ BotAlias: string; BotName: string; Operation: string; }> {
    return {
      "namespace": "AWS/Lex",
      "metricName": "RuntimeSystemErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static runtimeThrottledEventsSum(dimensions: { BotAlias: string; BotName: string; Operation: string; }): MetricWithDims<{ BotAlias: string; BotName: string; Operation: string; }> {
    return {
      "namespace": "AWS/Lex",
      "metricName": "RuntimeThrottledEvents",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static runtimeUserErrorsSum(dimensions: { BotAlias: string; BotName: string; Operation: string; }): MetricWithDims<{ BotAlias: string; BotName: string; Operation: string; }> {
    return {
      "namespace": "AWS/Lex",
      "metricName": "RuntimeUserErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}