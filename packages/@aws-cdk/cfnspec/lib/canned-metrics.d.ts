export type NonEmptyArray<T> = [T, ...T[]];
/**
 * A single canned service metric
 *
 * These are kindly provided to us by the good people of CloudWatch Explorer.
 */
export interface CannedMetric {
    /**
     * Metric namespace
     */
    readonly namespace: string;
    /**
     * Metric name
     */
    readonly metricName: string;
    /**
     * List of all possible dimension permutations for this metric
     *
     * Most metrics will have a single list of strings as their one set of
     * allowed dimensions, but some metrics are emitted under multiple
     * combinations of dimensions.
     */
    readonly dimensions: NonEmptyArray<string[]>;
    /**
     * Suggested default aggregration statistic
     *
     * Not always the most appropriate one to use! These defaults have
     * been classified by people and they generally just pick "Average"
     * as the default, even if it doesn't make sense.
     *
     * For example: for event-based metrics that only ever emit `1`
     * (and never `0`) the better statistic would be `Sum`.
     *
     * Use your judgement based on the type of metric this is.
     */
    readonly defaultStat: string;
}
/**
 * Return the list of canned metrics for the given service
 */
export declare function cannedMetricsForService(cloudFormationNamespace: string): CannedMetric[];
