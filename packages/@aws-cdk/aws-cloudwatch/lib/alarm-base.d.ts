import { IResource, Resource } from '@aws-cdk/core';
import { IAlarmAction } from './alarm-action';
/**
 * Interface for Alarm Rule.
 */
export interface IAlarmRule {
    /**
     * serialized representation of Alarm Rule to be used when building the Composite Alarm resource.
     */
    renderAlarmRule(): string;
}
/**
 * Represents a CloudWatch Alarm
 */
export interface IAlarm extends IAlarmRule, IResource {
    /**
     * Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo)
     *
     * @attribute
     */
    readonly alarmArn: string;
    /**
     * Name of the alarm
     *
     * @attribute
     */
    readonly alarmName: string;
}
/**
 * The base class for Alarm and CompositeAlarm resources.
 */
export declare abstract class AlarmBase extends Resource implements IAlarm {
    /**
     * @attribute
     */
    abstract readonly alarmArn: string;
    abstract readonly alarmName: string;
    protected alarmActionArns?: string[];
    protected insufficientDataActionArns?: string[];
    protected okActionArns?: string[];
    /**
     * AlarmRule indicating ALARM state for Alarm.
     */
    renderAlarmRule(): string;
    /**
     * Trigger this action if the alarm fires
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    addAlarmAction(...actions: IAlarmAction[]): void;
    /**
     * Trigger this action if there is insufficient data to evaluate the alarm
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    addInsufficientDataAction(...actions: IAlarmAction[]): void;
    /**
     * Trigger this action if the alarm returns from breaching state into ok state
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    addOkAction(...actions: IAlarmAction[]): void;
}
