/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class LambdaMetrics {
  public static concurrentExecutionsMaximum(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static concurrentExecutionsMaximum(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static concurrentExecutionsMaximum(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static concurrentExecutionsMaximum(dimensions: {  }): MetricWithDims<{  }>;

  public static concurrentExecutionsMaximum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "ConcurrentExecutions",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }

  public static deadLetterErrorsSum(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static deadLetterErrorsSum(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static deadLetterErrorsSum(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static deadLetterErrorsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static deadLetterErrorsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "DeadLetterErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static destinationDeliveryFailuresSum(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static destinationDeliveryFailuresSum(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static destinationDeliveryFailuresSum(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static destinationDeliveryFailuresSum(dimensions: {  }): MetricWithDims<{  }>;

  public static destinationDeliveryFailuresSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "DestinationDeliveryFailures",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static durationAverage(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static durationAverage(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static durationAverage(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static durationAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static durationAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "Duration",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static errorsSum(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static errorsSum(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static errorsSum(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static errorsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static errorsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "Errors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static invocationsSum(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static invocationsSum(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static invocationsSum(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static invocationsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static invocationsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "Invocations",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static iteratorAgeAverage(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static iteratorAgeAverage(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static iteratorAgeAverage(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static iteratorAgeAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static iteratorAgeAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "IteratorAge",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static postRuntimeExtensionsDurationAverage(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static postRuntimeExtensionsDurationAverage(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static postRuntimeExtensionsDurationAverage(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static postRuntimeExtensionsDurationAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static postRuntimeExtensionsDurationAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "PostRuntimeExtensionsDuration",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static provisionedConcurrencyInvocationsSum(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static provisionedConcurrencyInvocationsSum(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static provisionedConcurrencyInvocationsSum(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static provisionedConcurrencyInvocationsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static provisionedConcurrencyInvocationsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "ProvisionedConcurrencyInvocations",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static provisionedConcurrencySpilloverInvocationsSum(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static provisionedConcurrencySpilloverInvocationsSum(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static provisionedConcurrencySpilloverInvocationsSum(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static provisionedConcurrencySpilloverInvocationsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static provisionedConcurrencySpilloverInvocationsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "ProvisionedConcurrencySpilloverInvocations",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static provisionedConcurrencyUtilizationMaximum(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static provisionedConcurrencyUtilizationMaximum(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static provisionedConcurrencyUtilizationMaximum(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static provisionedConcurrencyUtilizationMaximum(dimensions: {  }): MetricWithDims<{  }>;

  public static provisionedConcurrencyUtilizationMaximum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "ProvisionedConcurrencyUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }

  public static provisionedConcurrentExecutionsMaximum(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static provisionedConcurrentExecutionsMaximum(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static provisionedConcurrentExecutionsMaximum(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static provisionedConcurrentExecutionsMaximum(dimensions: {  }): MetricWithDims<{  }>;

  public static provisionedConcurrentExecutionsMaximum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "ProvisionedConcurrentExecutions",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }

  public static throttlesSum(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static throttlesSum(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static throttlesSum(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static throttlesSum(dimensions: {  }): MetricWithDims<{  }>;

  public static throttlesSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "Throttles",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static unreservedConcurrentExecutionsMaximum(dimensions: { FunctionName: string; }): MetricWithDims<{ FunctionName: string; }>;

  public static unreservedConcurrentExecutionsMaximum(dimensions: { FunctionName: string; Resource: string; }): MetricWithDims<{ FunctionName: string; Resource: string; }>;

  public static unreservedConcurrentExecutionsMaximum(dimensions: { ExecutedVersion: string; FunctionName: string; Resource: string; }): MetricWithDims<{ ExecutedVersion: string; FunctionName: string; Resource: string; }>;

  public static unreservedConcurrentExecutionsMaximum(dimensions: {  }): MetricWithDims<{  }>;

  public static unreservedConcurrentExecutionsMaximum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/Lambda",
      "metricName": "UnreservedConcurrentExecutions",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }
}