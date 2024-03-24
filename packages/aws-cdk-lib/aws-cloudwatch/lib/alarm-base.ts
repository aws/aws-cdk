import { Construct } from 'constructs';
import { IAlarmAction } from './alarm-action';
import { ArnFormat, IResource, Resource, Stack } from '../../core';

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
export abstract class AlarmBase extends Resource implements IAlarm {

  /**
   * Import an existing CloudWatch alarm provided a Name.
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param alarmName Alarm Name
   */
  public static fromAlarmName(scope: Construct, id: string, alarmName: string): IAlarm {
    const stack = Stack.of(scope);

    return this.fromAlarmArn(scope, id, stack.formatArn({
      service: 'cloudwatch',
      resource: 'alarm',
      resourceName: alarmName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    }));
  }

  /**
   * Import an existing CloudWatch alarm provided an ARN
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name
   * @param alarmArn Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo)
   */
  public static fromAlarmArn(scope: Construct, id: string, alarmArn: string): IAlarm {
    class Import extends AlarmBase implements IAlarm {
      public readonly alarmArn = alarmArn;
      public readonly alarmName = Stack.of(scope).splitArn(alarmArn, ArnFormat.COLON_RESOURCE_NAME).resourceName!;
    }
    return new Import(scope, id);
  }

  /**
   * @attribute
   */
  public abstract readonly alarmArn: string;
  public abstract readonly alarmName: string;

  protected alarmActionArns?: string[];
  protected insufficientDataActionArns?: string[];
  protected okActionArns?: string[];

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
