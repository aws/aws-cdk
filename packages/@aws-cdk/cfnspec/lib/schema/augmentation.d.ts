/**
 * Augmentations for a CloudFormation resource type
 */
export interface ResourceAugmentation {
    /**
     * Metric augmentations for this resource type
     */
    metrics?: ResourceMetricAugmentations;
    /**
     * Options for this resource augmentation
     *
     * @default no options
     */
    options?: AugmentationOptions;
}
export interface AugmentationOptions {
    /**
     * The name of the file containing the class to be "augmented".
     *
     * @default kebab cased CloudFormation resource name + '-base'
     */
    classFile?: string;
    /**
     * The name of the class to be "augmented".
     *
     * @default CloudFormation resource name + 'Base'
     */
    class?: string;
    /**
     * The name of the file containing the interface to be "augmented".
     *
     * @default - same as ``classFile``.
     */
    interfaceFile?: string;
    /**
     * The name of the interface to be "augmented".
     *
     * @default 'I' + CloudFormation resource name
     */
    interface?: string;
}
export interface ResourceMetricAugmentations {
    namespace: string;
    dimensions: {
        [key: string]: string;
    };
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
export declare enum MetricType {
    /**
     * This metric measures an attribute of events
     *
     * It could be time, or request size, or similar. The default
     * aggregate for this type of event is "Avg".
     */
    Attrib = "attrib",
    /**
     * This metric is counting events.
     *
     * This means the metric "1" is emitted every time an event occurs.
     * Only "Sum" is a meaningful aggregate of this type of metric.
     */
    Count = "count",
    /**
     * This metric is emitting a size.
     *
     * The metric is not event-based, but measures some global ever-changing
     * property. The most useful aggregate of this type of metric is "Max".
     */
    Gauge = "gauge"
}
