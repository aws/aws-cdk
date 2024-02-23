/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class Route53ResolverMetrics {
  public static inboundQueryVolumeSum(dimensions: { EndpointId: string; }): MetricWithDims<{ EndpointId: string; }> {
    return {
      "namespace": "AWS/Route53Resolver",
      "metricName": "InboundQueryVolume",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static outboundQueryVolumeSum(dimensions: { EndpointId: string; }): MetricWithDims<{ EndpointId: string; }> {
    return {
      "namespace": "AWS/Route53Resolver",
      "metricName": "OutboundQueryVolume",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static outboundQueryAggregateVolumeSum(dimensions: { EndpointId: string; }): MetricWithDims<{ EndpointId: string; }> {
    return {
      "namespace": "AWS/Route53Resolver",
      "metricName": "OutboundQueryAggregateVolume",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}