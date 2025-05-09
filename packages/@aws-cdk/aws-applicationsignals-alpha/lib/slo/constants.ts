/**
 * Types of metrics that can be used for SLIs
 */
export enum MetricType {
    /**
     * Latency-based metric type
     * Used for measuring response time or duration
     */
    LATENCY = 'LATENCY',

    /**
     * Availability-based metric type
     * Used for measuring uptime or success rate
     */
    AVAILABILITY = 'AVAILABILITY'
}

/**
 * Default values for goal configuration
 */
export const DEFAULT_GOAL_CONFIG = {
    ATTAINMENT_GOAL: 99.9,
    WARNING_THRESHOLD: 30,
} as const;

/**
 * Comparison operators for metric thresholds
 */
export enum ComparisonOperator {
    /**
     * Greater than operator
     * True if metric value is strictly greater than threshold
     */
    GREATER_THAN = 'GREATER_THAN',

    /**
     * Less than operator
     * True if metric value is strictly less than threshold
     */
    LESS_THAN = 'LESS_THAN',

    /**
     * Greater than or equal operator
     * True if metric value is greater than or equal to threshold
     */
    GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',

    /**
     * Less than or equal operator
     * True if metric value is less than or equal to threshold
     */
    LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL'
}

/**
 * Statistical methods for aggregating metric values
 */
export enum MetricStatistic {
    /**
     * Average of all values in the period
     */
    AVERAGE = 'Average',

    /**
     * Sum of all values in the period
     */
    SUM = 'Sum',

    /**
     * Minimum value in the period
     */
    MINIMUM = 'Minimum',

    /**
     * Maximum value in the period
     */
    MAXIMUM = 'Maximum',

    /**
     * Count of samples in the period
     */
    SAMPLE_COUNT = 'SampleCount',

    /**
     * 99th percentile of values in the period
     */
    P99 = 'p99',

    /**
     * 95th percentile of values in the period
     */
    P95 = 'p95',

    /**
     * 90th percentile of values in the period
     */
    P90 = 'p90',

    /**
     * 50th percentile (median) of values in the period
     */
    P50 = 'p50'
}

/**
 * Types of services that can be monitored
 */
export enum KeyAttributeType {
    /**
     * Service running in your account
     */
    SERVICE = 'SERVICE',

    /**
     * AWS managed service
     */
    AWS_SERVICE = 'AWS_SERVICE',

    /**
     * External service
     */
    REMOTE_SERVICE = 'REMOTE_SERVICE',

    /**
     * Resource
     */

    RESOURCE = 'RESOURCE',

    /**
     * AWS managed Resource
     */

    AWS_RESOURCE = 'AWS::RESOURCE'

}

/**
 * Units for duration measurement in SLO intervals
 */
export enum DurationUnit {
    /**
     * Minute unit for fine-grained intervals
     */
    MINUTE = 'MINUTE',

    /**
     * Hour unit for medium-term intervals
     */
    HOUR = 'HOUR',

    /**
     * Day unit for daily intervals
     */
    DAY = 'DAY',

    /**
     * Month unit for long-term intervals
     * Used for calendar-aligned monitoring
     */
    MONTH = 'MONTH'
}
