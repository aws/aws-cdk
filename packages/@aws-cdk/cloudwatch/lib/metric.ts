import { Construct } from "@aws-cdk/core";
import { Alarm, ComparisonOperator, TreatMissingData } from "./alarm";

export type DimensionHash = {[dim: string]: any};

/**
 * Properties for a metric
 */
export interface MetricProps {
    /**
     * Dimensions of the metric
     *
     * @default No dimensions
     */
    dimensions?: DimensionHash;

    /**
     * Namespace of the metric.
     */
    namespace: string;

    /**
     * Name of the metric.
     */
    metricName: string;

    /**
     * The period over which the specified statistic is applied.
     *
     * Specify time in seconds, in multiples of 60.
     *
     * @default 300
     */
    periodSec?: number;

    /**
     * What function to use for aggregating.
     *
     * Can be one of the following (case insensitive)
     *
     * - "minimum" | "min"
     * - "maximum" | "max"
     * - "average" | "avg"
     * - "sum"
     * - "samplecount | "n"
     * - "pNN.NN"
     *
     * @default Average
     */
    statistic?: string;

    /**
     * Unit for the metric that is associated with the alarm
     */
    unit?: Unit;

    /**
     * Label for this metric when added to a Graph in a Dashboard
     */
    label?: string;

    /**
     * Color for this metric when added to a Graph in a Dashboard
     */
    color?: string;
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
export class Metric {
    public readonly dimensions?: DimensionHash;
    public readonly namespace: string;
    public readonly metricName: string;
    public readonly periodSec: number;
    public readonly statistic: string;
    public readonly unit?: Unit;
    public readonly label?: string;
    public readonly color?: string;

    constructor(props: MetricProps) {
        if (props.periodSec !== undefined
            && props.periodSec !== 1 && props.periodSec !== 5 && props.periodSec !== 10 && props.periodSec !== 30
            && props.periodSec % 60 !== 0) {
            throw new Error("'periodSec' must be 1, 5, 10, 30, or a multiple of 60");
        }

        this.dimensions = props.dimensions;
        this.namespace = props.namespace;
        this.metricName = props.metricName;
        this.periodSec = props.periodSec !== undefined ? props.periodSec : 300;
        this.statistic = props.statistic || "Average";
        this.label = props.label;
        this.color = props.color;
        this.unit = props.unit;

        // Try parsing, this will throw if it's not a valid stat
        parseStatistic(this.statistic);
    }

    /**
     * Return a copy of Metric with properties changed.
     *
     * All properties except namespace and metricName can be changed.
     *
     * @param props The set of properties to change.
     */
    public with(props: MetricCustomizations): Metric {
        return new Metric({
            dimensions: ifUndefined(props.dimensions, this.dimensions),
            namespace: this.namespace,
            metricName: this.metricName,
            periodSec: ifUndefined(props.periodSec, this.periodSec),
            statistic: ifUndefined(props.statistic, this.statistic),
            unit: ifUndefined(props.unit, this.unit),
            label: ifUndefined(props.label, this.label),
            color: ifUndefined(props.color, this.color)
        });
    }

    /**
     * Make a new Alarm for this metric
     *
     * Combines both properties that may adjust the metric (aggregation) as well
     * as alarm properties.
     */
    public newAlarm(parent: Construct, name: string, props: NewAlarmProps): Alarm {
        return new Alarm(parent, name, {
            metric: this.with({
                statistic: props.statistic,
                periodSec: props.periodSec,
            }),
            alarmName: props.alarmName,
            alarmDescription: props.alarmDescription,
            comparisonOperator: props.comparisonOperator,
            threshold: props.threshold,
            evaluationPeriods: props.evaluationPeriods,
            evaluateLowSampleCountPercentile: props.evaluateLowSampleCountPercentile,
            treatMissingData: props.treatMissingData,
            actionsEnabled: props.actionsEnabled,
        });
    }

    /**
     * Return the JSON structure which represents this metric in an alarm
     *
     * This will be called by Alarm, no need for clients to call this.
     */
    public alarmInfo(): AlarmMetricInfo {
        const stat = parseStatistic(this.statistic);

        return {
            dimensions: hashToDimensions(this.dimensions),
            namespace: this.namespace,
            metricName: this.metricName,
            period: this.periodSec,
            statistic: stat.type === 'simple' ? stat.statistic : undefined,
            extendedStatistic: stat.type === 'percentile' ? 'p' + stat.percentile : undefined,
            unit: this.unit
        };
    }

    /**
     * Return the JSON structure which represents this metric in a graph
     *
     * This will be called by GraphWidget, no need for clients to call this.
     */
    public graphJson(yAxis: string): any[] {
        // Namespace and metric Name
        const ret: any[] = [
            this.namespace,
            this.metricName,
        ];

        // Dimensions
        for (const dim of hashToDimensions(this.dimensions) || []) {
            ret.push(dim.name, dim.value);
        }

        // Options
        const stat = parseStatistic(this.statistic);
        ret.push({
            yAxis,
            label: this.label,
            color: this.color,
            period: this.periodSec,
            stat: stat.type === 'simple' ? stat.statistic : 'p' + stat.percentile.toString(),
        });

        return ret;
    }
}

/**
 * Properties used to construct the Metric identifying part of an Alarm
 */
export interface AlarmMetricInfo {
    /**
     * The dimensions to apply to the alarm
     */
    dimensions?: Dimension[];

    /**
     * Namespace of the metric
     */
    namespace: string;

    /**
     * Name of the metric
     */
    metricName: string;

    /**
     * How many seconds to aggregate over
     */
    period: number;

    /**
     * Simple aggregation function to use
     */
    statistic?: Statistic;

    /**
     * Percentile aggregation function to use
     */
    extendedStatistic?: string;

    /**
     * The unit of the alarm
     */
    unit?: Unit;
}

/**
 * Metric dimension
 */
export interface Dimension {
    /**
     * Name of the dimension
     */
    name: string;

    /**
     * Value of the dimension
     */
    value: any;
}

/**
 * Statistic to use over the aggregation period
 */
export enum Statistic {
    SampleCount = 'SampleCount',
    Average = 'Average',
    Sum = 'Sum',
    Minimum = 'Minimum',
    Maximum = 'Maximum',
}

/**
 * Unit for metric
 */
export enum Unit {
    Seconds = 'Seconds',
    Microseconds = 'Microseconds',
    Milliseconds = 'Milliseconds',
    Bytes_ = 'Bytes',
    Kilobytes = 'Kilobytes',
    Megabytes = 'Megabytes',
    Gigabytes = 'Gigabytes',
    Terabytes = 'Terabytes',
    Bits = 'Bits',
    Kilobits = 'Kilobits',
    Megabits = 'Megabits',
    Gigabits = 'Gigabits',
    Terabits = 'Terabits',
    Percent = 'Percent',
    Count = 'Count',
    BytesPerSecond = 'Bytes/Second',
    KilobytesPerSecond = 'Kilobytes/Second',
    MegabytesPerSecond = 'Megabytes/Second',
    GigabytesPerSecond = 'Gigabytes/Second',
    TerabytesPerSecond = 'Terabytes/Second',
    BitsPerSecond = 'Bits/Second',
    KilobitsPerSecond = 'Kilobits/Second',
    MegabitsPerSecond = 'Megabits/Second',
    GigabitsPerSecond = 'Gigabits/Second',
    TerabitsPerSecond = 'Terabits/Second',
    CountPerSecond = 'Count/Second',
    None = 'None'
}

/**
 * Properties of a metric that can be changed
 */
export interface MetricCustomizations {
    /**
     * Dimensions of the metric
     *
     * @default No dimensions
     */
    dimensions?: DimensionHash;

    /**
     * The period over which the specified statistic is applied.
     *
     * Specify time in seconds, in multiples of 60.
     *
     * @default 300
     */
    periodSec?: number;

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
     * @default Average
     */
    statistic?: string;

    /**
     * Unit for the metric that is associated with the alarm
     */
    unit?: Unit;

    /**
     * Label for this metric when added to a Graph in a Dashboard
     */
    label?: string;

    /**
     * Color for this metric when added to a Graph in a Dashboard
     */
    color?: string;
}

/**
 * Properties to make an alarm from a metric
 */
export interface NewAlarmProps {
    /**
     * The period over which the specified statistic is applied.
     *
     * Specify time in seconds, in multiples of 60.
     *
     * @default 300
     */
    periodSec?: number;

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
     * @default Average
     */
    statistic?: string;

    /**
     * Name of the alarm
     *
     * @default Automatically generated name
     */
    alarmName?: string;

    /**
     * Description for the alarm
     *
     * @default No description
     */
    alarmDescription?: string;

    /**
     * Comparison to use to check if metric is breaching
     *
     * @default GreaterThanOrEqualToThreshold
     */
    comparisonOperator?: ComparisonOperator;

    /**
     * The value against which the specified statistic is compared.
     */
    threshold: number;

    /**
     * The number of periods over which data is compared to the specified threshold.
     */
    evaluationPeriods: number;

    /**
     * Specifies whether to evaluate the data and potentially change the alarm state if there are too few data points to be statistically significant.
     *
     * Used only for alarms that are based on percentiles.
     */
    evaluateLowSampleCountPercentile?: string;

    /**
     * Sets how this alarm is to handle missing data points.
     *
     * @default TreatMissingData.Missing
     */
    treatMissingData?: TreatMissingData;

    /**
     * Whether the actions for this alarm are enabled
     *
     * @default true
     */
    actionsEnabled?: boolean;
}

function hashToDimensions(x?: DimensionHash): Dimension[] | undefined {
    if (x === undefined) {
        return undefined;
    }

    const list = Object.keys(x).map(key => ({ name: key, value: x[key] }));
    if (list.length === 0) {
        return undefined;
    }

    return list;
}

function ifUndefined<T>(x: T | undefined, def: T | undefined): T | undefined {
    if (x !== undefined) {
        return x;
    }
    return def;
}

interface SimpleStatistic {
    type: 'simple';
    statistic: Statistic;
}

interface PercentileStatistic {
    type: 'percentile';
    percentile: number;
}

/**
 * Parse a statistic, returning the type of metric that was used (simple or percentile)
 */
function parseStatistic(stat: string): SimpleStatistic | PercentileStatistic {
    const lowerStat = stat.toLowerCase();

    // Simple statistics
    const statMap: {[k: string]: Statistic} = {
        average: Statistic.Average,
        avg: Statistic.Average,
        minimum: Statistic.Minimum,
        min: Statistic.Minimum,
        maximum: Statistic.Maximum,
        max: Statistic.Maximum,
        samplecount: Statistic.SampleCount,
        n: Statistic.SampleCount,
        sum: Statistic.Sum,
    };

    if (lowerStat in statMap) {
        return {
            type: 'simple',
            statistic: statMap[lowerStat]
        };
    }

    // Percentile statistics
    const re = /^p([\d.]+)$/;
    const m = re.exec(lowerStat);
    if (m) {
        return {
            type: 'percentile',
            percentile: parseFloat(m[1])
        };
    }

    throw new Error(`Not a valid statistic: '${stat}', must be one of Average | Minimum | Maximum | SampleCount | Sum | pNN.NN`);
}