import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
/**
 * Metrics on the rate limiting performed on state machine execution.
 *
 * These rate limits are shared across all state machines.
 */
export declare class StateTransitionMetric {
    /**
     * Return the given named metric for the service's state transition metrics
     *
     * @default average over 5 minutes
     */
    static metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of available state transitions.
     *
     * @default average over 5 minutes
     */
    static metricProvisionedBucketSize(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the provisioned steady-state execution rate
     *
     * @default average over 5 minutes
     */
    static metricProvisionedRefillRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of available state transitions per second
     *
     * @default average over 5 minutes
     */
    static metricConsumedCapacity(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of throttled state transitions
     *
     * @default sum over 5 minutes
     */
    static metricThrottledEvents(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}
