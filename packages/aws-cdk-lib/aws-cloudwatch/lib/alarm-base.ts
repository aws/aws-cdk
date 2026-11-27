import type { IAlarmAction } from './alarm-action';
import type { AlarmMuteRuleOptions } from './alarm-mute-rule';
import { AlarmMuteRule } from './alarm-mute-rule';
import type { Duration, IResource } from '../../core';
import { Resource } from '../../core';
import type { IArrayBox } from '../../core/lib/helpers-internal';
import { Box } from '../../core/lib/helpers-internal';
import type { IAlarmRef, AlarmReference } from '../../interfaces/generated/aws-cloudwatch-interfaces.generated';

/**
 * The warm-up configuration for an alarm.
 *
 * A warm-up period delays alarm evaluation after the alarm is created. During the warm-up period the
 * alarm stays in `INSUFFICIENT_DATA` and does not perform alarm actions. Warm-up applies once, when the
 * alarm is created: updating an alarm that is still warming up changes or ends its warm-up, while adding
 * or changing a warm-up configuration on an alarm whose warm-up has already ended does not start a new one.
 *
 * Warm-up is available for metric alarms, including metric math, Metrics Insights queries and anomaly
 * detection. It is not available for `PromQLAlarm` or `CompositeAlarm`.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-warm-up.html
 */
export interface AlarmWarmUpConfiguration {
  /**
   * The length of the warm-up period that starts when the alarm is created.
   *
   * Must be a whole number of minutes between 1 minute and 2 days (2880 minutes).
   * CloudFormation stores the value in minutes, so `Duration.seconds(90)` is rejected at synthesis time.
   */
  readonly warmUpPeriod: Duration;

  /**
   * Whether the alarm must wait for the full warm-up period before it starts evaluating.
   *
   * When false, the alarm ends warm-up early and starts evaluating as soon as it has enough metric data
   * to fill its evaluation window (`period` x `evaluationPeriods`). When true, the alarm waits for the
   * whole warm-up period even if data arrives sooner.
   *
   * @default false
   */
  readonly onlyStartEvaluatingAfterWarmUpPeriodEnds?: boolean;
}

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
export interface IAlarm extends IAlarmRule, IResource, IAlarmRef {
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
export abstract class AlarmBase extends Resource implements IAlarm {
  /**
   * @attribute
   */
  public abstract readonly alarmArn: string;
  public abstract readonly alarmName: string;

  /** @internal */
  protected readonly _alarmActionArns: IArrayBox<string> = Box.fromArray();
  /** @internal */
  protected readonly _insufficientDataActionArns: IArrayBox<string> = Box.fromArray();
  /** @internal */
  protected readonly _okActionArns: IArrayBox<string> = Box.fromArray();

  protected get alarmActionArns(): string[] | undefined {
    return this._alarmActionArns.length > 0 ? [...this._alarmActionArns] : undefined;
  }
  protected set alarmActionArns(value: string[] | undefined) {
    this._alarmActionArns.set(value ?? []);
  }
  protected get insufficientDataActionArns(): string[] | undefined {
    return this._insufficientDataActionArns.length > 0 ? [...this._insufficientDataActionArns] : undefined;
  }
  protected set insufficientDataActionArns(value: string[] | undefined) {
    this._insufficientDataActionArns.set(value ?? []);
  }
  protected get okActionArns(): string[] | undefined {
    return this._okActionArns.length > 0 ? [...this._okActionArns] : undefined;
  }
  protected set okActionArns(value: string[] | undefined) {
    this._okActionArns.set(value ?? []);
  }

  public get alarmRef(): AlarmReference {
    return {
      alarmName: this.alarmName,
      alarmArn: this.alarmArn,
    };
  }

  /**
   * AlarmRule indicating ALARM state for Alarm.
   */
  public renderAlarmRule(): string {
    return `ALARM("${this.alarmArn}")`;
  }

  /**
   * Trigger this action if the alarm fires
   *
   * Typically SnsAction or AutoScalingAction.
   */
  public addAlarmAction(...actions: IAlarmAction[]) {
    this._alarmActionArns.push(...actions.map(a => a.bind(this, this).alarmActionArn));
  }

  /**
   * Trigger this action if there is insufficient data to evaluate the alarm
   *
   * Typically SnsAction or AutoScalingAction.
   */
  public addInsufficientDataAction(...actions: IAlarmAction[]) {
    this._insufficientDataActionArns.push(...actions.map(a => a.bind(this, this).alarmActionArn));
  }

  /**
   * Trigger this action if the alarm returns from breaching state into ok state
   *
   * Typically SnsAction or AutoScalingAction.
   */
  public addOkAction(...actions: IAlarmAction[]) {
    this._okActionArns.push(...actions.map(a => a.bind(this, this).alarmActionArn));
  }

  /**
   * Add an alarm mute rule.
   */
  public addAlarmMuteRule(id: string, options: AlarmMuteRuleOptions) {
    return new AlarmMuteRule(this, id, { ...options, alarms: [this] });
  }
}
