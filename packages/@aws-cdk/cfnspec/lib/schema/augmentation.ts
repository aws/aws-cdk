/**
 * Augmentations for a CloudFormation resource type
 */
export interface ResourceAugmentation {
  /**
   * Metric augmentations for this resource type
   */
  metrics?: ResourceMetricAugmentations;

  /**
   * Overrides for this resource augmentation
   */
  overrides?: ResourceOverrides;
}

export interface ResourceOverrides {
  /**
   * The name of the resource class
   */
  class?: string;

  /**
   * The name of the resource interface
   */
  interface?: string;

  /**
   * The name of the module
   */
  module?: string;
}

export interface ResourceMetricAugmentations {
  namespace: string;
  dimensions: {[key: string]: string};
  metrics: ResourceMetric[];
}

export interface ResourceMetric {
  /**
   * Uppercase-first metric name
   */
  name: string;

  /**
   * Documentation line
   */
  documentation: string;

  /**
   * Whether this is an even count (1 gets emitted every time something occurs)
   *
   * @default MetricType.Attrib
   */
  type?: MetricType;
}

export enum MetricType {
  /**
   * This metric measures an attribute of events
   *
   * It could be time, or request size, or similar. The default
   * aggregate for this type of event is "Avg".
   */
  Attrib = 'attrib',

  /**
   * This metric is counting events.
   *
   * This means the metric "1" is emitted every time an event occurs.
   * Only "Sum" is a meaningful aggregate of this type of metric.
   */
  Count = 'count',

  /**
   * This metric is emitting a size.
   *
   * The metric is not event-based, but measures some global ever-changing
   * property. The most useful aggregate of this type of metric is "Max".
   */
  Gauge = 'gauge'
}
