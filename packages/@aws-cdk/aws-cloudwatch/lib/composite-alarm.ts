import { Construct, Lazy, Resource, Stack } from '@aws-cdk/core';
import { AlarmBase, IAlarm, IAlarmRule } from './alarm';
import { CfnCompositeAlarm } from './cloudwatch.generated';

/**
 * Enumeration of supported Composite Alarms operators.
 */
enum Operator {

  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',

}

/**
 * AlarmRule to express TRUE/FALSE intent in Rule Expression.
 */
export class BooleanAlarmRule implements IAlarmRule {

  private readonly booleanValue: boolean;

  constructor(booleanValue: boolean) {
    this.booleanValue = booleanValue;
  }

  public toAlarmRule(): string {
    return `${String(this.booleanValue).toUpperCase()}`;
  }

}

abstract class BinaryAlarmRule implements IAlarmRule {

  private readonly operands: IAlarmRule[];
  private readonly operator: Operator;

  constructor(operator: Operator, ...operands: IAlarmRule[]) {
    this.operands = operands;
    this.operator = operator;
  }

  public toAlarmRule(): string {
    return this.operands
      .map(operand => `(${operand.toAlarmRule()})`)
      .join(` ${this.operator} `);
  }

}

/**
 * AlarmRule to join all provided AlarmRules with AND operator.
 */
export class AndAlarmRule extends BinaryAlarmRule {

  constructor(...operands: IAlarmRule[]) {
    super(Operator.AND, ...operands);
  }
}

/**
 * AlarmRule to join all provided AlarmRules with OR operator.
 */
export class OrAlarmRule extends BinaryAlarmRule {

  constructor(...operands: IAlarmRule[]) {
    super(Operator.OR, ...operands);
  }
}

/**
 * AlarmRule to wrap provided AlarmRule in NOT operator.
 */
export class NotAlarmRule implements IAlarmRule {

  private readonly operand: IAlarmRule;

  constructor(operand: IAlarmRule) {
    this.operand = operand;
  }

  public toAlarmRule(): string {
    return `(NOT ${this.operand.toAlarmRule()})`;
  }

}

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
   * @default No description
   */
  readonly alarmDescription?: string;

  /**
   * Name of the alarm
   *
   * @default Automatically generated name
   */
  readonly compositeAlarmName?: string;

  /**
   * Expression that specifies which other alarms are to be evaluated to determine this composite alarm's state.
   */
  readonly alarmRule: IAlarmRule;

}

/**
 * A Composite Alarm based on Alarm Rule.
 */
export class CompositeAlarm extends AlarmBase {

  /**
   * Import an existing CloudWatch composite alarm provided an Name.
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param compositeAlarmName Composite Alarm Name
   */
  public static fromCompositeAlarmName(scope: Construct, id: string, compositeAlarmName: string): IAlarm {
    const stack = Stack.of(scope);

    return this.fromCompositeAlarmArn(scope, id, stack.formatArn({
      service: 'cloudwatch',
      resource: 'alarm',
      resourceName: compositeAlarmName,
    }));
  }

  /**
   * Import an existing CloudWatch composite alarm provided an ARN.
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param compositeAlarmArn Composite Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm/CompositeAlarmName)
   */
  public static fromCompositeAlarmArn(scope: Construct, id: string, compositeAlarmArn: string): IAlarm {
    class Import extends Resource implements IAlarm {
      public readonly alarmArn = compositeAlarmArn;
      public readonly alarmName = Stack.of(scope).parseArn(compositeAlarmArn).resourceName!;
    }
    return new Import(scope, id);
  }

  /**
   * ARN of this alarm
   *
   * @attribute
   */
  public readonly alarmArn: string;

  /**
   * Name of this alarm.
   *
   * @attribute
   */
  public readonly alarmName: string;

  constructor(scope: Construct, id: string, props: CompositeAlarmProps) {
    super(scope, id, {
      physicalName: props.compositeAlarmName ?? Lazy.stringValue({ produce: () => this.generateUniqueId() }),
    });

    if (props.alarmRule.toAlarmRule().length > 10240) {
      throw new Error('Alarm Rule expression cannot be greater than 10240 characters, please reduce the conditions in the Alarm Rule');
    }

    const alarm = new CfnCompositeAlarm(this, 'Resource', {
      alarmName: this.physicalName,
      alarmRule: props.alarmRule.toAlarmRule(),
      alarmDescription: props.alarmDescription,
      actionsEnabled: props.actionsEnabled,
      alarmActions: Lazy.listValue({ produce: () => this.alarmActionArns }),
      insufficientDataActions: Lazy.listValue({ produce: (() => this.insufficientDataActionArns) }),
      okActions: Lazy.listValue({ produce: () => this.okActionArns }),
    });

    this.alarmName = this.getResourceNameAttribute(alarm.ref);
    this.alarmArn = this.getResourceArnAttribute(alarm.attrArn, {
      service: 'cloudwatch',
      resource: 'alarm',
      resourceName: this.physicalName,
    });

  }

  private generateUniqueId(): string {
    const name = this.node.uniqueId;
    if (name.length > 240) {
      return name.substring(0, 120) + name.substring(name.length - 120);
    }
    return name;
  }

}
