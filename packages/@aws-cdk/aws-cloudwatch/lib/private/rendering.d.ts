import { IMetric } from '../metric-types';
/**
 * Return the JSON structure which represents these metrics in a graph.
 *
 * Depending on the metric type (stat or expression), one `Metric` object
 * can render to multiple time series.
 *
 * - Top-level metrics will be rendered visibly, additionally added metrics will
 *   be rendered invisibly.
 * - IDs used in math expressions need to be either globally unique, or refer to the same
 *   metric object.
 *
 * This will be called by GraphWidget, no need for clients to call this.
 */
export declare function allMetricsGraphJson(left: IMetric[], right: IMetric[]): any[];
/**
 * A single metric in a MetricSet
 */
export interface MetricEntry<A> {
    /**
     * The metric object
     */
    readonly metric: IMetric;
    /**
     * The tag, added if the object is a primary metric
     */
    tag?: A;
    /**
     * ID for this metric object
     */
    id?: string;
}
/**
 * Contain a set of metrics, expanding math expressions
 *
 * "Primary" metrics (added via a top-level call) can be tagged with an additional value.
 */
export declare class MetricSet<A> {
    private readonly metrics;
    private readonly metricById;
    private readonly metricByKey;
    /**
     * Add the given set of metrics to this set
     */
    addTopLevel(tag: A, ...metrics: IMetric[]): void;
    /**
     * Access all the accumulated timeseries entries
     */
    get entries(): ReadonlyArray<MetricEntry<A>>;
    /**
     * Add a metric into the set
     *
     * The id may not be the same as a previous metric added, unless it's the same metric.
     *
     * It can be made visible, in which case the new "metric" object replaces the old
     * one (and the new ones "renderingPropertieS" will be honored instead of the old
     * one's).
     */
    private addOne;
}
