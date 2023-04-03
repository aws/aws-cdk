import { Construct } from 'constructs';
import { IAlarmAction } from './alarm-action';
import { AlarmBase, IAlarm } from './alarm-base';
import { HorizontalAnnotation } from './graph';
import { CreateAlarmOptions } from './metric';
import { IMetric } from './metric-types';
/**
 * Properties for Alarms
 */
export interface AlarmProps extends CreateAlarmOptions {
    /**
     * The metric to add the alarm on
     *
     * Metric objects can be obtained from most resources, or you can construct
     * custom Metric objects by instantiating one.
     */
    readonly metric: IMetric;
}
/**
 * Comparison operator for evaluating alarms
 */
export declare enum ComparisonOperator {
    /**
     * Specified statistic is greater than or equal to the threshold
     */
    GREATER_THAN_OR_EQUAL_TO_THRESHOLD = "GreaterThanOrEqualToThreshold",
    /**
     * Specified statistic is strictly greater than the threshold
     */
    GREATER_THAN_THRESHOLD = "GreaterThanThreshold",
    /**
     * Specified statistic is strictly less than the threshold
     */
    LESS_THAN_THRESHOLD = "LessThanThreshold",
    /**
     * Specified statistic is less than or equal to the threshold.
     */
    LESS_THAN_OR_EQUAL_TO_THRESHOLD = "LessThanOrEqualToThreshold",
    /**
     * Specified statistic is lower than or greater than the anomaly model band.
     * Used only for alarms based on anomaly detection models
     */
    LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD = "LessThanLowerOrGreaterThanUpperThreshold",
    /**
     * Specified statistic is greater than the anomaly model band.
     * Used only for alarms based on anomaly detection models
     */
    GREATER_THAN_UPPER_THRESHOLD = "GreaterThanUpperThreshold",
    /**
     * Specified statistic is lower than the anomaly model band.
     * Used only for alarms based on anomaly detection models
     */
    LESS_THAN_LOWER_THRESHOLD = "LessThanLowerThreshold"
}
/**
 * Specify how missing data points are treated during alarm evaluation
 */
export declare enum TreatMissingData {
    /**
     * Missing data points are treated as breaching the threshold
     */
    BREACHING = "breaching",
    /**
     * Missing data points are treated as being within the threshold
     */
    NOT_BREACHING = "notBreaching",
    /**
     * The current alarm state is maintained
     */
    IGNORE = "ignore",
    /**
     * The alarm does not consider missing data points when evaluating whether to change state
     */
    MISSING = "missing"
}
/**
 * An alarm on a CloudWatch metric
 */
export declare class Alarm extends AlarmBase {
    /**
     * Import an existing CloudWatch alarm provided an ARN
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name
     * @param alarmArn Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo)
     */
    static fromAlarmArn(scope: Construct, id: string, alarmArn: string): IAlarm;
    /**
     * ARN of this alarm
     *
     * @attribute
     */
    readonly alarmArn: string;
    /**
     * Name of this alarm.
     *
     * @attribute
     */
    readonly alarmName: string;
    /**
     * The metric object this alarm was based on
     */
    readonly metric: IMetric;
    /**
     * This metric as an annotation
     */
    private readonly annotation;
    constructor(scope: Construct, id: string, props: AlarmProps);
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
    toAnnotation(): HorizontalAnnotation;
    /**
     * Trigger this action if the alarm fires
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    addAlarmAction(...actions: IAlarmAction[]): void;
    private validateActionArn;
    private renderMetric;
    /**
     * Validate that if a region is in the given stat config, they match the Alarm
     */
    private validateMetricStat;
    /**
     * Validates that the expression config does not specify searchAccount or searchRegion props
     * as search expressions are not supported by Alarms.
     */
    private validateMetricExpression;
    /**
     * Determine if the accountId property should be included in the metric.
     */
    private requiresAccountId;
}
