import { IAlarm, IAlarmRule } from './alarm-base';
import { UnscopedValidationError } from '../../core';

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
 * Options to AT_LEAST AlarmRule wrapper function
 */
export interface HasAtLeastOptions {

  /**
   * function to wrap provided AlarmRule in AT_LEAST expression.
   */
  readonly operands: IAlarm[];

  /**
   * minimum number of specified alarms
   *
   * Units: Count
   *
   * @default - Exactly one of `count`, `percentage` is required.
   */
  readonly count?: number;
  /**
   * minimum percentage of specified alarms
   *
   * Units: Percentage
   *
   * @default - Exactly one of `count`, `percentage` is required.
   */
  readonly percentage?: number;
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
   * function to wrap provided AlarmRule in AT_LEAST expression for ALARM state.
   *
   * @param options options for creating a new AlarmRule.
   */
  public static hasAtLeastAlarm(options: HasAtLeastOptions): IAlarmRule {
    const alarmState = `${AlarmState.ALARM}`;
    return this.hasAtLeast(alarmState, options);
  }

  /**
   * function to wrap provided AlarmRule in AT_LEAST expression for OK state.
   *
   * @param options options for creating a new AlarmRule.
   */
  public static hasAtLeastOk(options: HasAtLeastOptions): IAlarmRule {
    const alarmState = `${AlarmState.OK}`;
    return this.hasAtLeast(alarmState, options);
  }

  /**
   * function to wrap provided AlarmRule in AT_LEAST expression for INSUFFICIENT_DATA state.
   *
   * @param options options for creating a new AlarmRule.
   */
  public static hasAtLeastInsufficient(options: HasAtLeastOptions): IAlarmRule {
    const alarmState = `${AlarmState.INSUFFICIENT_DATA}`;
    return this.hasAtLeast(alarmState, options);
  }

  /**
   * function to wrap provided AlarmRule in AT_LEAST expression for NOT ALARM state.
   *
   * @param options options for creating a new AlarmRule.
   */
  public static hasAtLeastNotAlarm(options: HasAtLeastOptions): IAlarmRule {
    const alarmState = `${Operator.NOT} ${AlarmState.ALARM}`;
    return this.hasAtLeast(alarmState, options);
  }

  /**
   * function to wrap provided AlarmRule in AT_LEAST expression for NOT OK state.
   *
   * @param options options for creating a new AlarmRule.
   */
  public static hasAtLeastNotOk(options: HasAtLeastOptions): IAlarmRule {
    const alarmState = `${Operator.NOT} ${AlarmState.OK}`;
    return this.hasAtLeast(alarmState, options);
  }

  /**
   * function to wrap provided AlarmRule in AT_LEAST expression for NOT INSUFFICIENT_DATA state.
   *
   * @param options options for creating a new AlarmRule.
   */
  public static hasAtLeastNotInsufficient(options: HasAtLeastOptions): IAlarmRule {
    const alarmState = `${Operator.NOT} ${AlarmState.INSUFFICIENT_DATA}`;
    return this.hasAtLeast(alarmState, options);
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
  public static fromAlarm(alarm: IAlarm, alarmState: AlarmState): IAlarmRule {
    return new class implements IAlarmRule {
      public renderAlarmRule(): string {
        return `${alarmState}("${alarm.alarmArn}")`;
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
          throw new UnscopedValidationError(`Did not detect any operands for AlarmRule.${operator === Operator.AND ? 'allOf' : 'anyOf'}()`);
        }

        const expression = operands
          .map(operand => `${operand.renderAlarmRule()}`)
          .join(` ${operator} `);
        return `(${expression})`;
      }
    };
  }

  private static hasAtLeast(alarmState: string, options: HasAtLeastOptions): IAlarmRule {
    return new class implements IAlarmRule {
      public renderAlarmRule(): string {
        if (options.operands.length === 0) {
          throw new UnscopedValidationError(`Did not detect any operands for AT_LEAST ${alarmState}`);
        }

        if ((options.count !== undefined) === (options.percentage !== undefined)) {
          throw new UnscopedValidationError('Specify exactly one of \'count\' and \'percentage\'');
        }

        if (options.count !== undefined && (options.count < 1 || options.operands.length < options.count
        || !Number.isInteger(options.count))) {
          throw new UnscopedValidationError(`count must be between 1 and alarm length(${options.operands.length}) integer, got ${options.count}`);
        }

        if (options.percentage !== undefined && (options.percentage < 1
        || 100 < options.percentage || !Number.isInteger(options.percentage))) {
          throw new UnscopedValidationError(`percentage must be between 1 and 100, got ${options.percentage}`);
        }

        const threshold = options.count || `${options.percentage}%`;
        const concatAlarms = options.operands
          .map(operand => `${operand.alarmArn}`)
          .join(', ');
        return `AT_LEAST(${threshold}, ${alarmState} , (${concatAlarms}))`;
      }
    };
  }
}
