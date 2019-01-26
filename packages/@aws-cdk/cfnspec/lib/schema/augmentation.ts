/**
 * Augmentations for a CloudFormation resource type
 */
export interface ResourceAugmentation {
  /**
   * Metric augmentations for this resource type
   */
  metrics?: ResourceMetricAugmentations;
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
   * @default false
   */
  isEventCount?: boolean;
}