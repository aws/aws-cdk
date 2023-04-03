import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AlarmBase, IAlarm, IAlarmRule } from './alarm-base';
/**
 * Properties for creating a Composite Alarm
 */
export interface CompositeAlarmProps {
    /**
     * Whether the actions for this alarm are enabled
     *
     * @default true
     */
    readonly actionsEnabled?: boolean;
    /**
     * Description for the alarm
     *
     * @default - No description.
     */
    readonly alarmDescription?: string;
    /**
     * Name of the alarm
     *
     * @default - Automatically generated name.
     */
    readonly compositeAlarmName?: string;
    /**
     * Expression that specifies which other alarms are to be evaluated to determine this composite alarm's state.
     */
    readonly alarmRule: IAlarmRule;
    /**
     * Actions will be suppressed if the suppressor alarm is in the ALARM state.
     *
     * @default - alarm will not be suppressed.
     */
    readonly actionsSuppressor?: IAlarm;
    /**
     * The maximum duration that the composite alarm waits after suppressor alarm goes out of the ALARM state.
     * After this time, the composite alarm performs its actions.
     *
     * @default - 1 minute extension period will be set.
     */
    readonly actionsSuppressorExtensionPeriod?: Duration;
    /**
     * The maximum duration that the composite alarm waits for the suppressor alarm to go into the ALARM state.
     * After this time, the composite alarm performs its actions.
     *
     * @default - 1 minute wait period will be set.
     */
    readonly actionsSuppressorWaitPeriod?: Duration;
}
/**
 * A Composite Alarm based on Alarm Rule.
 */
export declare class CompositeAlarm extends AlarmBase {
    /**
     * Import an existing CloudWatch composite alarm provided an Name.
     *
     * @param scope The parent creating construct (usually `this`)
     * @param id The construct's name
     * @param compositeAlarmName Composite Alarm Name
     */
    static fromCompositeAlarmName(scope: Construct, id: string, compositeAlarmName: string): IAlarm;
    /**
     * Import an existing CloudWatch composite alarm provided an ARN.
     *
     * @param scope The parent creating construct (usually `this`)
     * @param id The construct's name
     * @param compositeAlarmArn Composite Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm/CompositeAlarmName)
     */
    static fromCompositeAlarmArn(scope: Construct, id: string, compositeAlarmArn: string): IAlarm;
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
    private readonly alarmRule;
    constructor(scope: Construct, id: string, props: CompositeAlarmProps);
    private generateUniqueId;
}
