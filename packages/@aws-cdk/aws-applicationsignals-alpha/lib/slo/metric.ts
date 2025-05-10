import { ComparisonOperator, MetricStatistic, MetricType } from './constants';
import { KeyAttributes } from './keyAttributes';

/**
 * Interface for metric dimension
 */
export interface MetricDimension {
    /**
     * Name of the dimension
     *
     * @required
     */
    readonly name: string;

    /**
     * Value of the dimension
     *
     * @required
     */
    readonly value: string;
}

/**
 * Properties for Application Signals metrics
 */
export interface ApplicationSignalsMetricProps {
    /**
     * Type of the metric
     *
     * @required
     */
    readonly metricType: MetricType;

    /**
     * Key attributes for the service
     *
     * @required
     */
    readonly keyAttributes: KeyAttributes;

    /**
     * Operation name
     *
     * @default - undefined
     */
    readonly operationName?: string;

    /**
     * Period in seconds
     * Required for period-based SLOs
     *
     * @required
     */
    readonly periodSeconds: number;

    /**
     * Statistic to use
     * Required for period-based SLOs
     *
     * @required
     */
    readonly statistic: string;
}

/**
 * Properties for CloudWatch metrics
 */
export interface CloudWatchMetricProps {
    /**
     * Metric data queries
     *
     * @required
     */
    readonly metricDataQueries: MetricDataQuery[];

    /**
     * Period in seconds
     * Required for period-based SLOs
     *
     * @required
     */
    readonly periodSeconds: number;

    /**
     * Statistic to use
     * Required for period-based SLOs
     *
     * @required
     */
    readonly statistic: string;
}

/**
 * Properties for SLI metric configuration
 */
export type SliMetricBaseProps = {
    /**
     * The threshold value for the metric
     *
     * @required
     */
    readonly metricThreshold: number;

    /**
     * The comparison operator
     *
     * @default - Based on metric type
     */
    readonly comparisonOperator?: ComparisonOperator;
} & (ApplicationSignalsMetricProps | CloudWatchMetricProps);


/**
 * Properties for a metric statistic
 */
export interface MetricStat {
    /**
     * The metric to query
     *
     * @required
     */
    readonly metric: MetricDefinition;

    /**
     * The period in seconds
     * Must be a multiple of 60
     *
     * @default 60
     */
    readonly period: number;

    /**
     * The statistic to use
     *
     * @required
     */
    readonly stat: string;

    /**
     * The unit of the metric
     *
     * @default - no unit
     */
    readonly unit?: string;
}

/**
 * Interface for metric definition
 */
export interface MetricDefinition {
    /**
     * Name of the metric
     *
     * @required
     */
    readonly metricName: string;

    /**
     * Namespace of the metric
     *
     * @required
     */
    readonly namespace: string;

    /**
     * Optional dimensions for the metric
     *
     * @default - no dimensions
     */
    readonly dimensions?: MetricDimension[];
}

/**
 * Properties for a CloudWatch metric data query
 * Used to define how metrics should be queried and processed
 */
export interface MetricDataQuery {
    /**
     * Unique identifier for the query
     * Used to reference this query in math expressions
     * Must be unique within the set of queries
     *
     * @required
     */
    readonly id: string;

    /**
     * AWS account ID where the metric is located
     *
     * @default - current account
     */
    readonly accountId?: string;

    /**
     * The math expression
     * Cannot be specified if metricStat is specified
     *
     * @default - undefined
     */
    readonly expression?: string;

    /**
     * The metric statistic configuration
     * Cannot be specified if expression is specified
     *
     * @default - undefined
     */
    readonly metricStat?: MetricStat;

    /**
     * Whether this query should return data to be used in results
     * Set to true for queries that produce final values
     * Set to false for intermediate calculations
     *
     * @default false
     */
    readonly returnData?: boolean;
}

/**
 * Period-based metric properties with Application Signals
 */
export interface PeriodBasedAppSignalsMetricProps extends SliMetricBaseProps {
    /**
     * The type of metric being measured
     * Can be LATENCY or AVAILABILITY
     *
     * @required
     */
    readonly metricType: MetricType;

    /**
     * Key attributes for the service being monitored
     * Must include at least one of Type, Name, and Environment
     *
     * @required
     */
    readonly keyAttributes: { [key: string]: string };

    /**
     * The name of the operation being measured
     * Used to filter metrics for specific operation
     *
     */
    readonly operationName?: string;

    /**
     * The period in seconds for metric aggregation
     * Must be a multiple of 60
     *
     * @required
     */
    readonly periodSeconds: number;

    /**
     * The statistic to use for aggregation
     * Examples: Average, Sum, p99
     *
     * @required
     */
    readonly statistic: MetricStatistic;
}

/**
 * Period-based metric properties with CloudWatch metrics
 */
export interface PeriodBasedCloudWatchMetricProps extends SliMetricBaseProps {
    /**
     * The metric data queries to execute
     * Can include raw metrics and math expressions
     *
     * @required
     */
    readonly metricDataQueries: MetricDataQuery[];

    /**
     * The period in seconds for metric aggregation
     * Must be a multiple of 60
     *
     * @required
     */
    readonly periodSeconds: number;

    /**
     * The statistic to use for aggregation
     * Examples: Average, Sum, p99
     *
     * @required
     */
    readonly statistic: MetricStatistic;
}

/**
 * Request-based metric properties with Application Signals
 */
export interface RequestBasedAppSignalsMetricProps extends SliMetricBaseProps {
    /**
     * The type of metric being measured
     * Can be LATENCY or AVAILABILITY
     *
     * @required
     */
    readonly metricType: MetricType;

    /**
     * Key attributes for the applications being monitored
     * Must include at least one of Type, Name, and Environment
     *
     * @required
     */
    readonly keyAttributes: { [key: string]: string };

    /**
     * The name of the operation being measured
     *
     */
    readonly operationName?: string;
}

/**
 * Request-based metric properties with CloudWatch metrics
 */
export interface RequestBasedCloudWatchMetricProps extends SliMetricBaseProps {
    /**
     * Metrics that count successful requests
     * Optional if can be derived from total - bad
     * Used to calculate success rate
     *
     * @required
     */
    readonly goodCountMetrics: MetricDataQuery[];

    /**
     * Metrics that count total requests
     * Used as denominator for success rate
     *
     * @required
     */
    readonly totalCountMetrics: MetricDataQuery[];

    /**
     * Metrics that count failed requests
     * Optional if can be derived from total - good
     *
     */
    readonly badCountMetrics?: MetricDataQuery[];
}

/**
 * Period-based metric properties
 */
export type PeriodBasedMetricProps = PeriodBasedAppSignalsMetricProps | PeriodBasedCloudWatchMetricProps;

/**
 * Request-based metric properties
 */
export type RequestBasedMetricProps = RequestBasedAppSignalsMetricProps | RequestBasedCloudWatchMetricProps;
