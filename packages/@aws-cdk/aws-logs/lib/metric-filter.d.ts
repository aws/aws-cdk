import { Metric, MetricOptions } from '@aws-cdk/aws-cloudwatch';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ILogGroup, MetricFilterOptions } from './log-group';
/**
 * Properties for a MetricFilter
 */
export interface MetricFilterProps extends MetricFilterOptions {
    /**
     * The log group to create the filter on.
     */
    readonly logGroup: ILogGroup;
}
/**
 * A filter that extracts information from CloudWatch Logs and emits to CloudWatch Metrics
 */
export declare class MetricFilter extends Resource {
    private readonly metricName;
    private readonly metricNamespace;
    constructor(scope: Construct, id: string, props: MetricFilterProps);
    /**
     * Return the given named metric for this Metric Filter
     *
     * @default avg over 5 minutes
     */
    metric(props?: MetricOptions): Metric;
}
