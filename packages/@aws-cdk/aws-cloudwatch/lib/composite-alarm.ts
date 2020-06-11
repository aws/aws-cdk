import { Construct, Lazy, Resource, Stack } from '@aws-cdk/core';
import { AlarmBase, AlarmState, IAlarm, IAlarmRule } from './alarm';
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
 * Class with static functions to build AlarmRule for Composite Alarms.
 */
export class AlarmRule {

  /**
   * function to join all provided AlarmRules with AND operator.
   *
   * @param operands IAlarmRules to be joined with AND operator.
   */
  public static allOf(...operands: IAlarmRule[]): IAlarmRule {
    return this.concat(Operator.AND, ...operands);
  }

  /**
   * function to join all provided AlarmRules with OR operator.
   *
   * @param operands IAlarmRules to be joined with OR operator.
   */
  public static anyOf(...operands: IAlarmRule[]): IAlarmRule {
    return this.concat(Operator.OR, ...operands);
  }

  /**
   * function to wrap provided AlarmRule in NOT operator.
   *
   * @param operand IAlarmRule to be wrapped in NOT operator.
   */
  public static not(operand: IAlarmRule): IAlarmRule {
    // tslint:disable-next-line:new-parens
    return new class implements IAlarmRule {
      public toAlarmRule(): string {
        return `(NOT ${operand.toAlarmRule()})`;
      }
    };
  }

  /**
   * function to build TRUE/FALSE intent for Rule Expression.
   *
   * @param value boolean value to be used in rule expression.
   */
  public static fromBoolean(value: boolean): IAlarmRule {
    // tslint:disable-next-line:new-parens
    return new class implements IAlarmRule {
      public toAlarmRule(): string {
        return `${String(value).toUpperCase()}`;
      }
    };
  }

  /**
   * function to build Rule Expression for given IAlarm and AlarmState.
   *
   * @param alarm IAlarm to be used in Rule Expression.
   * @param alarmState AlarmState to be used in Rule Expression.
   */
  public static fromAlarm(alarm: IAlarm, alarmState: AlarmState): IAlarmRule {
    // tslint:disable-next-line:new-parens
    return new class implements IAlarmRule {
      public toAlarmRule(): string {
        return `${alarmState}(${alarm.alarmArn})`;
      }
    };
  }

  /**
   * function to build Rule Expression for given Alarm Rule string.
   *
   * @param alarmRule string to be used in Rule Expression.
   */
  public static fromString(alarmRule: string): IAlarmRule {
    // tslint:disable-next-line:new-parens
    return new class implements IAlarmRule {
      public toAlarmRule(): string {
        return alarmRule;
      }
    };
  }

  private static concat(operator: Operator, ...operands: IAlarmRule[]): IAlarmRule {
    // tslint:disable-next-line:new-parens
    return new class implements IAlarmRule {
      public toAlarmRule(): string {
        return operands
          .map(operand => `(${operand.toAlarmRule()})`)
          .join(` ${operator} `);
      }
    };
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

      public toAlarmRule(): string {
        throw new Error('Method not implemented.');
      }
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

  private readonly alarmRule: string;

  constructor(scope: Construct, id: string, props: CompositeAlarmProps) {
    super(scope, id, {
      physicalName: props.compositeAlarmName ?? Lazy.stringValue({ produce: () => this.generateUniqueId() }),
    });

    if (props.alarmRule.toAlarmRule().length > 10240) {
      throw new Error('Alarm Rule expression cannot be greater than 10240 characters, please reduce the conditions in the Alarm Rule');
    }

    this.alarmRule = props.alarmRule.toAlarmRule();

    const alarm = new CfnCompositeAlarm(this, 'Resource', {
      alarmName: this.physicalName,
      alarmRule: this.alarmRule,
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

  public toAlarmRule(): string {
    return this.alarmRule;
  }

  private generateUniqueId(): string {
    const name = this.node.uniqueId;
    if (name.length > 240) {
      return name.substring(0, 120) + name.substring(name.length - 120);
    }
    return name;
  }

}
