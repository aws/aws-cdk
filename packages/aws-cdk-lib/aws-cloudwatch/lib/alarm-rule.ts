import type { IAlarm, IAlarmRule } from './alarm-base';
import { Token, UnscopedValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';
import type { IAlarmRef } from '../../interfaces/generated/aws-cloudwatch-interfaces.generated';

/**
 * Enumeration indicates state of Alarm used in building Alarm Rule.
 */
export enum AlarmState {
  /**
   * State indicates resource is in ALARM
   */
  ALARM = 'ALARM',

  /**
   * State indicates resource is not in ALARM
   */
  OK = 'OK',

  /**
   * State indicates there is not enough data to determine is resource is in ALARM
   */
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
}

/**
 * Enumeration of supported Composite Alarms operators.
 */
enum Operator {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
}

/**
 * Options for the AT_LEAST AlarmRule wrapper function.
 */
export interface AtLeastOptions {
  /**
   * Alarms to evaluate in the AT_LEAST expression.
   */
  readonly operands: IAlarm[];

  /**
   * Threshold for the AT_LEAST expression.
   *
   * Use `AtLeastThreshold.count()` for an absolute number
   * or `AtLeastThreshold.percentage()` for a percentage.
   */
  readonly threshold: AtLeastThreshold;
}

/**
 * Internal configuration returned by threshold binding.
 */
interface AtLeastThresholdConfig {
  /**
   * The threshold as a string for the AT_LEAST expression.
   *
   * Either a number (e.g. "2") or a percentage (e.g. "60%").
   */
  readonly threshold: string;
}

/**
 * Represents a threshold for the AT_LEAST expression in composite alarm rules.
 *
 * Use the static factory methods to create a threshold:
 *
 * ```
 * AtLeastThreshold.count(2)        // at least 2 alarms
 * AtLeastThreshold.percentage(60)  // at least 60% of alarms
 * ```
 */
export abstract class AtLeastThreshold {
  /**
   * Creates a count-based threshold for the AT_LEAST expression.
   *
   * The count must be a positive integer between 1 and the number of operands.
   *
   * @param count the minimum number of alarms that must be in the specified state
   */
  public static count(count: number): AtLeastThresholdCount {
    return new AtLeastThresholdCount(count);
  }

  /**
   * Creates a percentage-based threshold for the AT_LEAST expression.
   *
   * The percentage must be an integer between 1 and 100.
   *
   * @param percentage the minimum percentage of alarms that must be in the specified state
   */
  public static percentage(percentage: number): AtLeastThresholdPercentage {
    return new AtLeastThresholdPercentage(percentage);
  }

  /**
   * Called when the alarm rule is rendered to bind the threshold and validate.
   *
   * @internal
   */
  public abstract _bind(operands: IAlarm[]): AtLeastThresholdConfig;
}

/**
 * A count-based threshold for the AT_LEAST expression.
 *
 * Use `AtLeastThreshold.count()` to create an instance.
 */
export class AtLeastThresholdCount extends AtLeastThreshold {
  constructor(private readonly count: number) {
    super();
  }

  /**
   * @internal
   */
  public _bind(operands: IAlarm[]): AtLeastThresholdConfig {
    if (Token.isUnresolved(this.count)) {
      return { threshold: `${this.count}` };
    }

    if (this.count < 1 || operands.length < this.count || !Number.isInteger(this.count)) {
      throw new UnscopedValidationError(
        lit`InvalidAtLeastCount`,
        `count must be between 1 and alarm length(${operands.length}) integer, got ${this.count}`,
      );
    }

    return { threshold: `${this.count}` };
  }
}

/**
 * A percentage-based threshold for the AT_LEAST expression.
 *
 * Use `AtLeastThreshold.percentage()` to create an instance.
 */
export class AtLeastThresholdPercentage extends AtLeastThreshold {
  constructor(private readonly percentage: number) {
    super();
  }

  /**
   * @internal
   */
  public _bind(_operands: IAlarm[]): AtLeastThresholdConfig {
    if (Token.isUnresolved(this.percentage)) {
      return { threshold: `${this.percentage}%` };
    }

    if (this.percentage < 1 || 100 < this.percentage || !Number.isInteger(this.percentage)) {
      throw new UnscopedValidationError(
        lit`InvalidAtLeastPercentage`,
        `percentage must be between 1 and 100, got ${this.percentage}`,
      );
    }

    return { threshold: `${this.percentage}%` };
  }
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
    return new class implements IAlarmRule {
      public renderAlarmRule(): string {
        return `(NOT (${operand.renderAlarmRule()}))`;
      }
    };
  }

  /**
   * Function to create an AT_LEAST expression for the given alarm state.
   *
   * AT_LEAST evaluates to TRUE when at least the specified threshold of the
   * given alarms are in the specified state.
   *
   * Example: trigger when at least 2 of 3 alarms are in ALARM state:
   *
   * ```
   * AlarmRule.atLeast(AlarmState.ALARM, {
   *   operands: [alarm1, alarm2, alarm3],
   *   threshold: AtLeastThreshold.count(2),
   * })
   * ```
   *
   * @param alarmState the alarm state to evaluate against
   * @param options options including operands and threshold
   */
  public static atLeast(alarmState: AlarmState, options: AtLeastOptions): IAlarmRule {
    return this.renderAtLeast(`${alarmState}`, options);
  }

  /**
   * Function to create an AT_LEAST expression for the negated alarm state.
   *
   * AT_LEAST evaluates to TRUE when at least the specified threshold of the
   * given alarms are NOT in the specified state.
   *
   * Example: trigger when at least 60% of alarms are NOT in OK state:
   *
   * ```
   * AlarmRule.atLeastNot(AlarmState.OK, {
   *   operands: [alarm1, alarm2, alarm3],
   *   threshold: AtLeastThreshold.percentage(60),
   * })
   * ```
   *
   * @param alarmState the alarm state to negate and evaluate against
   * @param options options including operands and threshold
   */
  public static atLeastNot(alarmState: AlarmState, options: AtLeastOptions): IAlarmRule {
    return this.renderAtLeast(`${Operator.NOT} ${alarmState}`, options);
  }

  /**
   * function to build TRUE/FALSE intent for Rule Expression.
   *
   * @param value boolean value to be used in rule expression.
   */
  public static fromBoolean(value: boolean): IAlarmRule {
    return new class implements IAlarmRule {
      public renderAlarmRule(): string {
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
  public static fromAlarm(alarm: IAlarmRef, alarmState: AlarmState): IAlarmRule {
    return new class implements IAlarmRule {
      public renderAlarmRule(): string {
        return `${alarmState}("${alarm.alarmRef.alarmArn}")`;
      }
    };
  }

  /**
   * function to build Rule Expression for given Alarm Rule string.
   *
   * @param alarmRule string to be used in Rule Expression.
   */
  public static fromString(alarmRule: string): IAlarmRule {
    return new class implements IAlarmRule {
      public renderAlarmRule(): string {
        return alarmRule;
      }
    };
  }

  private static concat(operator: Operator, ...operands: IAlarmRule[]): IAlarmRule {
    return new class implements IAlarmRule {
      public renderAlarmRule(): string {
        if (operands.length === 0) {
          throw new UnscopedValidationError(
            lit`NoOperandsDetectedForAlarmRule`,
            `Did not detect any operands for AlarmRule.${operator === Operator.AND ? 'allOf' : 'anyOf'}()`,
          );
        }

        const expression = operands
          .map(operand => `${operand.renderAlarmRule()}`)
          .join(` ${operator} `);

        return `(${expression})`;
      }
    };
  }

  private static renderAtLeast(stateExpression: string, props: AtLeastOptions): IAlarmRule {
    return new class implements IAlarmRule {
      public renderAlarmRule(): string {
        if (props.operands.length === 0) {
          throw new UnscopedValidationError(
            lit`NoOperandsDetectedForAtLeast`,
            `Did not detect any operands for AT_LEAST ${stateExpression}`,
          );
        }

        const thresholdConfig = props.threshold._bind(props.operands);
        const concatAlarms = props.operands
          .map(operand => `${operand.alarmArn}`)
          .join(', ');

        return `AT_LEAST(${thresholdConfig.threshold}, ${stateExpression}, (${concatAlarms}))`;
      }
    };
  }
}
