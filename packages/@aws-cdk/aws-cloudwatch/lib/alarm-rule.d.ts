import { IAlarm, IAlarmRule } from './alarm-base';
/**
 * Enumeration indicates state of Alarm used in building Alarm Rule.
 */
export declare enum AlarmState {
    /**
     * State indicates resource is in ALARM
     */
    ALARM = "ALARM",
    /**
     * State indicates resource is not in ALARM
     */
    OK = "OK",
    /**
     * State indicates there is not enough data to determine is resource is in ALARM
     */
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"
}
/**
 * Class with static functions to build AlarmRule for Composite Alarms.
 */
export declare class AlarmRule {
    /**
     * function to join all provided AlarmRules with AND operator.
     *
     * @param operands IAlarmRules to be joined with AND operator.
     */
    static allOf(...operands: IAlarmRule[]): IAlarmRule;
    /**
     * function to join all provided AlarmRules with OR operator.
     *
     * @param operands IAlarmRules to be joined with OR operator.
     */
    static anyOf(...operands: IAlarmRule[]): IAlarmRule;
    /**
     * function to wrap provided AlarmRule in NOT operator.
     *
     * @param operand IAlarmRule to be wrapped in NOT operator.
     */
    static not(operand: IAlarmRule): IAlarmRule;
    /**
     * function to build TRUE/FALSE intent for Rule Expression.
     *
     * @param value boolean value to be used in rule expression.
     */
    static fromBoolean(value: boolean): IAlarmRule;
    /**
     * function to build Rule Expression for given IAlarm and AlarmState.
     *
     * @param alarm IAlarm to be used in Rule Expression.
     * @param alarmState AlarmState to be used in Rule Expression.
     */
    static fromAlarm(alarm: IAlarm, alarmState: AlarmState): IAlarmRule;
    /**
     * function to build Rule Expression for given Alarm Rule string.
     *
     * @param alarmRule string to be used in Rule Expression.
     */
    static fromString(alarmRule: string): IAlarmRule;
    private static concat;
}
