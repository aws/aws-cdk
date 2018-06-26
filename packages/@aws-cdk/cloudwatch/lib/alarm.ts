import { Arn, Construct, Token } from '@aws-cdk/core';
import { cloudwatch } from '@aws-cdk/resources';
import { Metric } from './metric';

/**
 * Properties for Alarms
 */
export interface AlarmProps {
    /**
     * The metric to add the alarm on
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
     * Number of datapoints that must be breaching to trigger the alarm
     *
     * This is used only if you are setting an "M out of N" alarm. In that case, this value is the M.
     *
     * @default Not an "M out of N" alarm.
     */
    datapointsToAlarm?: number;

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

/**
 * Comparison operator for evaluating alarms
 */
export enum ComparisonOperator {
    GreaterThanOrEqualToThreshold = 'GreaterThanOrEqualToThreshold',
    GreaterThanThreshold = 'GreaterThanThreshold',
    LessThanThreshold = 'LessThanThreshold',
    LessThanOrEqualToThreshold = 'LessThanOrEqualToThreshold',
}

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

    constructor(parent: Construct, name: string, props: AlarmProps) {
        super(parent, name);

        const alarm = new cloudwatch.AlarmResource(this, 'Resource', {
            actionsEnabled: props.actionsEnabled,
            alarmActions: new Token(() => this.alarmActions),
            alarmDescription: props.alarmDescription,
            alarmName: props.alarmName,
            comparisonOperator: props.comparisonOperator || ComparisonOperator.GreaterThanOrEqualToThreshold,
            evaluateLowSampleCountPercentile: props.evaluateLowSampleCountPercentile,
            evaluationPeriods: props.evaluationPeriods,
            insufficientDataActions: new Token(() => this.insufficientDataActions),
            okActions: new Token(() => this.okActions),
            threshold: props.threshold,
            treatMissingData: props.treatMissingData,
            ...props.metric.toAlarmJson()
        });

        this.alarmArn = alarm.alarmArn;
        this.metric = props.metric;
    }

    /**
     * Trigger this action if the alarm fires
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    public onAlarm(arn: Arn) {
        if (this.alarmActions === undefined) {
            this.alarmActions = [];
        }

        this.alarmActions.push(arn);
    }

    /**
     * Trigger this action if there is insufficient data to evaluate the alarm
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    public onInsufficientData(arn: Arn) {
        if (this.insufficientDataActions === undefined) {
            this.insufficientDataActions = [];
        }

        this.insufficientDataActions.push(arn);
    }

    /**
     * Trigger this action if the alarm returns from breaching state into ok state
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    public onOk(arn: Arn) {
        if (this.okActions === undefined) {
            this.okActions = [];
        }

        this.okActions.push(arn);
    }
}

/**
 * The ARN of an Alarm
 */
export class AlarmArn extends Arn {
}