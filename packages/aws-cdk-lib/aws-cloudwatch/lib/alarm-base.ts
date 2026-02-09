import type { IAlarmAction } from './alarm-action';
import type { IResource } from '../../core';
import { Resource } from '../../core';
import type { IAlarmRef, AlarmReference } from '../../interfaces/generated/aws-cloudwatch-interfaces.generated';

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

  protected alarmActionArns?: string[];
  protected insufficientDataActionArns?: string[];
  protected okActionArns?: string[];

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
    if (this.alarmActionArns === undefined) {
      this.alarmActionArns = [];
    }

    this.alarmActionArns.push(...actions.map(a => a.bind(this, this).alarmActionArn));
  }

  /**
   * Trigger this action if there is insufficient data to evaluate the alarm
   *
   * Typically SnsAction or AutoScalingAction.
   */
  public addInsufficientDataAction(...actions: IAlarmAction[]) {
    if (this.insufficientDataActionArns === undefined) {
      this.insufficientDataActionArns = [];
    }

    this.insufficientDataActionArns.push(...actions.map(a => a.bind(this, this).alarmActionArn));
  }

  /**
   * Trigger this action if the alarm returns from breaching state into ok state
   *
   * Typically SnsAction or AutoScalingAction.
   */
  public addOkAction(...actions: IAlarmAction[]) {
    if (this.okActionArns === undefined) {
      this.okActionArns = [];
    }

    this.okActionArns.push(...actions.map(a => a.bind(this, this).alarmActionArn));
  }
}
