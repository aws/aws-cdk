/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class SageMakerMetrics {
  public static invocationsSum(dimensions: { EndpointName: string; VariantName: string; }): MetricWithDims<{ EndpointName: string; VariantName: string; }> {
    return {
      "namespace": "AWS/SageMaker",
      "metricName": "Invocations",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static invocation5XxErrorsSum(dimensions: { EndpointName: string; VariantName: string; }): MetricWithDims<{ EndpointName: string; VariantName: string; }> {
    return {
      "namespace": "AWS/SageMaker",
      "metricName": "Invocation5XXErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static invocation4XxErrorsSum(dimensions: { EndpointName: string; VariantName: string; }): MetricWithDims<{ EndpointName: string; VariantName: string; }> {
    return {
      "namespace": "AWS/SageMaker",
      "metricName": "Invocation4XXErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static invocationsPerInstanceSum(dimensions: { EndpointName: string; VariantName: string; }): MetricWithDims<{ EndpointName: string; VariantName: string; }> {
    return {
      "namespace": "AWS/SageMaker",
      "metricName": "InvocationsPerInstance",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static modelLatencySum(dimensions: { EndpointName: string; VariantName: string; }): MetricWithDims<{ EndpointName: string; VariantName: string; }> {
    return {
      "namespace": "AWS/SageMaker",
      "metricName": "ModelLatency",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static overheadLatencySum(dimensions: { EndpointName: string; VariantName: string; }): MetricWithDims<{ EndpointName: string; VariantName: string; }> {
    return {
      "namespace": "AWS/SageMaker",
      "metricName": "OverheadLatency",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}