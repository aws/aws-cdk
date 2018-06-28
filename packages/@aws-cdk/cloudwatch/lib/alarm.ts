import { Arn, Construct, Token } from '@aws-cdk/core';
import { cloudwatch } from '@aws-cdk/resources';
import { HorizontalAnnotation } from './graph';
import { Metric } from './metric';

/**
 * Properties for Alarms
 */
export interface AlarmProps {
    /**
     * The metric to add the alarm on
     *
     * Metric objects can be obtained from most resources, or you can construct
     * custom Metric objects by instantiating one.
     */
    metric: Metric;

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
     * Specifies whether to evaluate the data and potentially change the alarm
     * state if there are too few data points to be statistically significant.
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

/**
 * Comparison operator for evaluating alarms
 */
export enum ComparisonOperator {
    GreaterThanOrEqualToThreshold = 'GreaterThanOrEqualToThreshold',
    GreaterThanThreshold = 'GreaterThanThreshold',
    LessThanThreshold = 'LessThanThreshold',
    LessThanOrEqualToThreshold = 'LessThanOrEqualToThreshold',
}

const OPERATOR_SYMBOLS: {[key: string]: string} = {
    GreaterThanOrEqualToThreshold: '>=',
    GreaterThanThreshold: '>',
    LessThanThreshold: '<',
    LessThanOrEqualToThreshold: '>=',
};

/**
 * Specify how missing data points are treated during alarm evaluation
 */
export enum TreatMissingData {
    /**
     * Missing data points are treated as breaching the threshold
     */
    Breaching = 'breaching',

    /**
     * Missing data points are treated as being within the threshold
     */
    NotBreaching = 'notBreaching',

    /**
     * The current alarm state is maintained
     */
    Ignore = 'ignore',

    /**
     * The alarm does not consider missing data points when evaluating whether to change state
     */
    Missing = 'missing'
}

/**
 * An alarm on a CloudWatch metric
 */
export class Alarm extends Construct {
    /**
     * ARN of this alarm
     */
    public readonly alarmArn: AlarmArn;

    /**
     * The metric object this alarm was based on
     */
    public readonly metric: Metric;

    private alarmActions?: Arn[];
    private insufficientDataActions?: Arn[];
    private okActions?: Arn[];

    /**
     * This metric as an annotation
     */
    private readonly annotation: HorizontalAnnotation;

    constructor(parent: Construct, name: string, props: AlarmProps) {
        super(parent, name);

        const comparisonOperator = props.comparisonOperator || ComparisonOperator.GreaterThanOrEqualToThreshold;

        const alarm = new cloudwatch.AlarmResource(this, 'Resource', {
            // Meta
            alarmDescription: props.alarmDescription,
            alarmName: props.alarmName,

            // Evaluation
            comparisonOperator,
            threshold: props.threshold,
            evaluateLowSampleCountPercentile: props.evaluateLowSampleCountPercentile,
            evaluationPeriods: props.evaluationPeriods,
            treatMissingData: props.treatMissingData,

            // Actions
            actionsEnabled: props.actionsEnabled,
            alarmActions: new Token(() => this.alarmActions),
            insufficientDataActions: new Token(() => this.insufficientDataActions),
            okActions: new Token(() => this.okActions),

            // Metric
            ...props.metric.toAlarmJson()
        });

        this.alarmArn = alarm.alarmArn;
        this.metric = props.metric;
        this.annotation = {
            // tslint:disable-next-line:max-line-length
            label: `${this.metric.label || this.metric.metricName} ${OPERATOR_SYMBOLS[comparisonOperator]} ${props.threshold} for ${props.evaluationPeriods} datapoints within ${describePeriod(props.evaluationPeriods * props.metric.periodSec)}`,
            value: props.threshold,
        };
    }

    /**
     * Trigger this action if the alarm fires
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    public onAlarm(action: IAlarmAction) {
        if (this.alarmActions === undefined) {
            this.alarmActions = [];
        }

        this.alarmActions.push(action.alarmActionArn);
    }

    /**
     * Trigger this action if there is insufficient data to evaluate the alarm
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    public onInsufficientData(action: IAlarmAction) {
        if (this.insufficientDataActions === undefined) {
            this.insufficientDataActions = [];
        }

        this.insufficientDataActions.push(action.alarmActionArn);
    }

    /**
     * Trigger this action if the alarm returns from breaching state into ok state
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    public onOk(action: IAlarmAction) {
        if (this.okActions === undefined) {
            this.okActions = [];
        }

        this.okActions.push(action.alarmActionArn);
    }

    /**
     * Turn this alarm into a horizontal annotation
     *
     * This is useful if you want to represent an Alarm in a non-AlarmWidget.
     * An `AlarmWidget` can directly show an alarm, but it can only show a
     * single alarm and no other metrics. Instead, you can convert the alarm to
     * a HorizontalAnnotation and add it as an annotation to another graph.
     *
     * This might be useful if:
     *
     * - You want to show multiple alarms inside a single graph, for example if
     *   you have both a "small margin/long period" alarm as well as a
     *   "large margin/short period" alarm.
     *
     * - You want to show an Alarm line in a graph with multiple metrics in it.
     */
    public toAnnotation(): HorizontalAnnotation {
        return this.annotation;
    }
}

/**
 * Return a human readable string for this period
 *
 * We know the seconds are always one of a handful of allowed values.
 */
function describePeriod(seconds: number) {
    if (seconds === 60) { return '1 minute'; }
    if (seconds === 1) { return '1 second'; }
    if (seconds > 60) { return (seconds / 60) + ' minutes'; }
    return seconds + ' seconds';
}

/**
 * The ARN of an Alarm
 */
export class AlarmArn extends Arn {
}

/**
 * Interface for objects that can be the targets of CloudWatch alarm actions
 */
export interface IAlarmAction {
    /**
     * Return the ARN that should be used for a CloudWatch Alarm action
     */
    readonly alarmActionArn: Arn;
}