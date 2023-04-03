import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';
import { Alarm, ComparisonOperator, TreatMissingData } from './alarm';
import { IMetric, MetricAlarmConfig, MetricConfig, MetricGraphConfig, Unit } from './metric-types';
export type DimensionHash = {
    [dim: string]: any;
};
export type DimensionsMap = {
    [dim: string]: string;
};
/**
 * Options shared by most methods accepting metric options
 */
export interface CommonMetricOptions {
    /**
     * The period over which the specified statistic is applied.
     *
     * @default Duration.minutes(5)
     */
    readonly period?: cdk.Duration;
    /**
     * What function to use for aggregating.
     *
     * Use the `aws_cloudwatch.Stats` helper class to construct valid input strings.
     *
     * Can be one of the following:
     *
     * - "Minimum" | "min"
     * - "Maximum" | "max"
     * - "Average" | "avg"
     * - "Sum" | "sum"
     * - "SampleCount | "n"
     * - "pNN.NN"
     * - "tmNN.NN" | "tm(NN.NN%:NN.NN%)"
     * - "iqm"
     * - "wmNN.NN" | "wm(NN.NN%:NN.NN%)"
     * - "tcNN.NN" | "tc(NN.NN%:NN.NN%)"
     * - "tsNN.NN" | "ts(NN.NN%:NN.NN%)"
     *
     * @default Average
     */
    readonly statistic?: string;
    /**
     * Dimensions of the metric
     *
     * @default - No dimensions.
     *
     * @deprecated Use 'dimensionsMap' instead.
     */
    readonly dimensions?: DimensionHash;
    /**
     * Dimensions of the metric
     *
     * @default - No dimensions.
     */
    readonly dimensionsMap?: DimensionsMap;
    /**
     * Unit used to filter the metric stream
     *
     * Only refer to datums emitted to the metric stream with the given unit and
     * ignore all others. Only useful when datums are being emitted to the same
     * metric stream under different units.
     *
     * The default is to use all matric datums in the stream, regardless of unit,
     * which is recommended in nearly all cases.
     *
     * CloudWatch does not honor this property for graphs.
     *
     * @default - All metric datums in the given metric stream
     */
    readonly unit?: Unit;
    /**
     * Label for this metric when added to a Graph in a Dashboard
     *
     * You can use [dynamic labels](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/graph-dynamic-labels.html)
     * to show summary information about the entire displayed time series
     * in the legend. For example, if you use:
     *
     * ```
     * [max: ${MAX}] MyMetric
     * ```
     *
     * As the metric label, the maximum value in the visible range will
     * be shown next to the time series name in the graph's legend.
     *
     * @default - No label
     */
    readonly label?: string;
    /**
     * The hex color code, prefixed with '#' (e.g. '#00ff00'), to use when this metric is rendered on a graph.
     * The `Color` class has a set of standard colors that can be used here.
     * @default - Automatic color
     */
    readonly color?: string;
    /**
     * Account which this metric comes from.
     *
     * @default - Deployment account.
     */
    readonly account?: string;
    /**
     * Region which this metric comes from.
     *
     * @default - Deployment region.
     */
    readonly region?: string;
}
/**
 * Properties for a metric
 */
export interface MetricProps extends CommonMetricOptions {
    /**
     * Namespace of the metric.
     */
    readonly namespace: string;
    /**
     * Name of the metric.
     */
    readonly metricName: string;
}
/**
 * Properties of a metric that can be changed
 */
export interface MetricOptions extends CommonMetricOptions {
}
/**
 * Configurable options for MathExpressions
 */
export interface MathExpressionOptions {
    /**
     * Label for this expression when added to a Graph in a Dashboard
     *
     * If this expression evaluates to more than one time series (for
     * example, through the use of `METRICS()` or `SEARCH()` expressions),
     * each time series will appear in the graph using a combination of the
     * expression label and the individual metric label. Specify the empty
     * string (`''`) to suppress the expression label and only keep the
     * metric label.
     *
     * You can use [dynamic labels](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/graph-dynamic-labels.html)
     * to show summary information about the displayed time series
     * in the legend. For example, if you use:
     *
     * ```
     * [max: ${MAX}] MyMetric
     * ```
     *
     * As the metric label, the maximum value in the visible range will
     * be shown next to the time series name in the graph's legend. If the
     * math expression produces more than one time series, the maximum
     * will be shown for each individual time series produce by this
     * math expression.
     *
     * @default - Expression value is used as label
     */
    readonly label?: string;
    /**
     * Color for this metric when added to a Graph in a Dashboard
     *
     * @default - Automatic color
     */
    readonly color?: string;
    /**
     * The period over which the expression's statistics are applied.
     *
     * This period overrides all periods in the metrics used in this
     * math expression.
     *
     * @default Duration.minutes(5)
     */
    readonly period?: cdk.Duration;
    /**
     * Account to evaluate search expressions within.
     *
     * Specifying a searchAccount has no effect to the account used
     * for metrics within the expression (passed via usingMetrics).
     *
     * @default - Deployment account.
     */
    readonly searchAccount?: string;
    /**
     * Region to evaluate search expressions within.
     *
     * Specifying a searchRegion has no effect to the region used
     * for metrics within the expression (passed via usingMetrics).
     *
     * @default - Deployment region.
     */
    readonly searchRegion?: string;
}
/**
 * Properties for a MathExpression
 */
export interface MathExpressionProps extends MathExpressionOptions {
    /**
     * The expression defining the metric.
     *
     * When an expression contains a SEARCH function, it cannot be used
     * within an Alarm.
     */
    readonly expression: string;
    /**
     * The metrics used in the expression, in a map.
     *
     * The key is the identifier that represents the given metric in the
     * expression, and the value is the actual Metric object.
     *
     * @default - Empty map.
     */
    readonly usingMetrics?: Record<string, IMetric>;
}
/**
 * A metric emitted by a service
 *
 * The metric is a combination of a metric identifier (namespace, name and dimensions)
 * and an aggregation function (statistic, period and unit).
 *
 * It also contains metadata which is used only in graphs, such as color and label.
 * It makes sense to embed this in here, so that compound constructs can attach
 * that metadata to metrics they expose.
 *
 * This class does not represent a resource, so hence is not a construct. Instead,
 * Metric is an abstraction that makes it easy to specify metrics for use in both
 * alarms and graphs.
 */
export declare class Metric implements IMetric {
    /**
     * Grant permissions to the given identity to write metrics.
     *
     * @param grantee The IAM identity to give permissions to.
     */
    static grantPutMetricData(grantee: iam.IGrantable): iam.Grant;
    /** Dimensions of this metric */
    readonly dimensions?: DimensionHash;
    /** Namespace of this metric */
    readonly namespace: string;
    /** Name of this metric */
    readonly metricName: string;
    /** Period of this metric */
    readonly period: cdk.Duration;
    /** Statistic of this metric */
    readonly statistic: string;
    /** Label for this metric when added to a Graph in a Dashboard */
    readonly label?: string;
    /** The hex color code used when this metric is rendered on a graph. */
    readonly color?: string;
    /** Unit of the metric. */
    readonly unit?: Unit;
    /** Account which this metric comes from */
    readonly account?: string;
    /** Region which this metric comes from. */
    readonly region?: string;
    /** Warnings attached to this metric. */
    readonly warnings?: string[];
    constructor(props: MetricProps);
    /**
     * Return a copy of Metric `with` properties changed.
     *
     * All properties except namespace and metricName can be changed.
     *
     * @param props The set of properties to change.
     */
    with(props: MetricOptions): Metric;
    /**
     * Attach the metric object to the given construct scope
     *
     * Returns a Metric object that uses the account and region from the Stack
     * the given construct is defined in. If the metric is subsequently used
     * in a Dashboard or Alarm in a different Stack defined in a different
     * account or region, the appropriate 'region' and 'account' fields
     * will be added to it.
     *
     * If the scope we attach to is in an environment-agnostic stack,
     * nothing is done and the same Metric object is returned.
     */
    attachTo(scope: IConstruct): Metric;
    toMetricConfig(): MetricConfig;
    /** @deprecated use toMetricConfig() */
    toAlarmConfig(): MetricAlarmConfig;
    /**
     * @deprecated use toMetricConfig()
     */
    toGraphConfig(): MetricGraphConfig;
    /**
     * Make a new Alarm for this metric
     *
     * Combines both properties that may adjust the metric (aggregation) as well
     * as alarm properties.
     */
    createAlarm(scope: Construct, id: string, props: CreateAlarmOptions): Alarm;
    toString(): string;
    /**
     * Return the dimensions of this Metric as a list of Dimension.
     */
    private dimensionsAsList;
    private validateDimensions;
}
/**
 * A math expression built with metric(s) emitted by a service
 *
 * The math expression is a combination of an expression (x+y) and metrics to apply expression on.
 * It also contains metadata which is used only in graphs, such as color and label.
 * It makes sense to embed this in here, so that compound constructs can attach
 * that metadata to metrics they expose.
 *
 * MathExpression can also be used for search expressions. In this case,
 * it also optionally accepts a searchRegion and searchAccount property for cross-environment
 * search expressions.
 *
 * This class does not represent a resource, so hence is not a construct. Instead,
 * MathExpression is an abstraction that makes it easy to specify metrics for use in both
 * alarms and graphs.
 */
export declare class MathExpression implements IMetric {
    /**
     * The expression defining the metric.
     */
    readonly expression: string;
    /**
     * The metrics used in the expression as KeyValuePair <id, metric>.
     */
    readonly usingMetrics: Record<string, IMetric>;
    /**
     * Label for this metric when added to a Graph.
     */
    readonly label?: string;
    /**
     * The hex color code, prefixed with '#' (e.g. '#00ff00'), to use when this metric is rendered on a graph.
     * The `Color` class has a set of standard colors that can be used here.
     */
    readonly color?: string;
    /**
     * Aggregation period of this metric
     */
    readonly period: cdk.Duration;
    /**
     * Account to evaluate search expressions within.
     */
    readonly searchAccount?: string;
    /**
     * Region to evaluate search expressions within.
     */
    readonly searchRegion?: string;
    /**
     * Warnings generated by this math expression
     */
    readonly warnings?: string[];
    constructor(props: MathExpressionProps);
    /**
     * Return a copy of Metric with properties changed.
     *
     * All properties except namespace and metricName can be changed.
     *
     * @param props The set of properties to change.
     */
    with(props: MathExpressionOptions): MathExpression;
    /**
     * @deprecated use toMetricConfig()
     */
    toAlarmConfig(): MetricAlarmConfig;
    /**
     * @deprecated use toMetricConfig()
     */
    toGraphConfig(): MetricGraphConfig;
    toMetricConfig(): MetricConfig;
    /**
     * Make a new Alarm for this metric
     *
     * Combines both properties that may adjust the metric (aggregation) as well
     * as alarm properties.
     */
    createAlarm(scope: Construct, id: string, props: CreateAlarmOptions): Alarm;
    toString(): string;
    private validateNoIdConflicts;
}
/**
 * Properties needed to make an alarm from a metric
 */
export interface CreateAlarmOptions {
    /**
     * The period over which the specified statistic is applied.
     *
     * Cannot be used with `MathExpression` objects.
     *
     * @default - The period from the metric
     * @deprecated Use `metric.with({ period: ... })` to encode the period into the Metric object
     */
    readonly period?: cdk.Duration;
    /**
     * What function to use for aggregating.
     *
     * Can be one of the following:
     *
     * - "Minimum" | "min"
     * - "Maximum" | "max"
     * - "Average" | "avg"
     * - "Sum" | "sum"
     * - "SampleCount | "n"
     * - "pNN.NN"
     *
     * Cannot be used with `MathExpression` objects.
     *
     * @default - The statistic from the metric
     * @deprecated Use `metric.with({ statistic: ... })` to encode the period into the Metric object
     */
    readonly statistic?: string;
    /**
     * Name of the alarm
     *
     * @default Automatically generated name
     */
    readonly alarmName?: string;
    /**
     * Description for the alarm
     *
     * @default No description
     */
    readonly alarmDescription?: string;
    /**
     * Comparison to use to check if metric is breaching
     *
     * @default GreaterThanOrEqualToThreshold
     */
    readonly comparisonOperator?: ComparisonOperator;
    /**
     * The value against which the specified statistic is compared.
     */
    readonly threshold: number;
    /**
     * The number of periods over which data is compared to the specified threshold.
     */
    readonly evaluationPeriods: number;
    /**
     * Specifies whether to evaluate the data and potentially change the alarm state if there are too few data points to be statistically significant.
     *
     * Used only for alarms that are based on percentiles.
     *
     * @default - Not configured.
     */
    readonly evaluateLowSampleCountPercentile?: string;
    /**
     * Sets how this alarm is to handle missing data points.
     *
     * @default TreatMissingData.Missing
     */
    readonly treatMissingData?: TreatMissingData;
    /**
     * Whether the actions for this alarm are enabled
     *
     * @default true
     */
    readonly actionsEnabled?: boolean;
    /**
     * The number of datapoints that must be breaching to trigger the alarm. This is used only if you are setting an "M
     * out of N" alarm. In that case, this value is the M. For more information, see Evaluating an Alarm in the Amazon
     * CloudWatch User Guide.
     *
     * @default ``evaluationPeriods``
     *
     * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation
     */
    readonly datapointsToAlarm?: number;
}
