
import { IAlarm, IAlarmRule } from './alarm-base';
import { Token, UnscopedValidationError } from '../../core';
import { IAlarmRef } from '../../interfaces/generated/aws-cloudwatch-interfaces.generated';

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
 * Options for AT_LEAST AlarmRule wrapper function
 */
export interface AtLeastOptions {

  /**
   * operands for AT_LEAST expression
   *
   * can specify an array of CloudWatch Alarms or Alarm Rule expressions
   */
  readonly operands: IAlarm[];

  /**
   * threshold for AT_LEAST expression
   *
   * threshold can be an absolute number or percentage
   */
  readonly threshold: AtLeastThreshold;
}

/**
 * configuration for creating a threshold for AT_LEAST expression
 */
interface AtLeastThresholdConfig {
  /**
   * threshold of AT_LEAST expression
   *
   * threshold can be an absolute number or percentage
   */
  readonly threshold: string;
}

/**
 * abstract base class for threshold for AT_LEAST expression
 */
export abstract class AtLeastThreshold {
  /**
   * Creates count threshold configration for AT_LEAST expression
   */
  public static count(count: number): AtLeastThresholdCount {
    return new AtLeastThresholdCount(count);
  }

  /**
   * Creates percentage threshold configration for AT_LEAST expression
   */
  public static percentage(percentage: number): AtLeastThresholdPercentage {
    return new AtLeastThresholdPercentage(percentage);
  }

  /**
   * Called when the threshold is initialized to allow this object to bind
   *
   * @internal
   */
  public abstract _bind(operands: IAlarm[]): AtLeastThresholdConfig;
}

/**
 * count threshold for AT_LEAST expression
 */
export class AtLeastThresholdCount extends AtLeastThreshold {
  constructor(private readonly count: number) {
    super();
  }

  /**
   * Called when the threshold is initialized to allow this object to bind
   *
   * @internal
   */
  _bind(operands: IAlarm[]): AtLeastThresholdConfig {
    if (this.count !== undefined && !Token.isUnresolved(this.count)
      && (this.count < 1 || operands.length < this.count || !Number.isInteger(this.count))) {
      throw new UnscopedValidationError(`count must be between 1 and alarm length(${operands.length}) integer, got ${this.count}`);
    }
    return {
      threshold: `${this.count}`,
    };
  }
}

/**
 * percentage threshold for AT_LEAST expression
 */
export class AtLeastThresholdPercentage extends AtLeastThreshold {
  constructor(private readonly percentage: number) {
    super();
  }
  /**
   * Called when the threshold is initialized to allow this object to bind
   *
   * @internal
   */
  _bind(_operands: IAlarm[]): AtLeastThresholdConfig {
    if (this.percentage !== undefined && !Token.isUnresolved(this.percentage)
      && (this.percentage < 1 || 100 < this.percentage || !Number.isInteger(this.percentage))) {
      throw new UnscopedValidationError(`percentage must be between 1 and 100, got ${this.percentage}`);
    }
    return {
      threshold: `${this.percentage}%`,
    };
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
   * function to wrap provided AlarmRule in AT_LEAST expression for ALARM state.
   *
   * @param options options for creating a new AlarmRule.
   */
  public static atLeastAlarm(options: AtLeastOptions): IAlarmRule {
    const alarmState = `${AlarmState.ALARM}`;
    return this.atLeast(alarmState, options);
  }

  /**
   * function to wrap provided AlarmRule in AT_LEAST expression for OK state.
   *
   * @param options options for creating a new AlarmRule.
   */
  public static atLeastOk(options: AtLeastOptions): IAlarmRule {
    const alarmState = `${AlarmState.OK}`;
    return this.atLeast(alarmState, options);
  }

  /**
   * function to wrap provided AlarmRule in AT_LEAST expression for INSUFFICIENT_DATA state.
   *
   * @param options options for creating a new AlarmRule.
   */
  public static atLeastInsufficient(options: AtLeastOptions): IAlarmRule {
    const alarmState = `${AlarmState.INSUFFICIENT_DATA}`;
    return this.atLeast(alarmState, options);
  }

  /**
   * function to wrap provided AlarmRule in AT_LEAST expression for NOT ALARM state.
   *
   * @param options options for creating a new AlarmRule.
   */
  public static atLeastNotAlarm(options: AtLeastOptions): IAlarmRule {
    const alarmState = `${Operator.NOT} ${AlarmState.ALARM}`;
    return this.atLeast(alarmState, options);
  }

  /**
   * function to wrap provided AlarmRule in AT_LEAST expression for NOT OK state.
   *
   * @param options options for creating a new AlarmRule.
   */
  public static atLeastNotOk(options: AtLeastOptions): IAlarmRule {
    options;
    const alarmState = `${Operator.NOT} ${AlarmState.OK}`;
    return this.atLeast(alarmState, options);
  }

  /**
   * function to wrap provided AlarmRule in AT_LEAST expression for NOT INSUFFICIENT_DATA state.
   *
   * @param options options for creating a new AlarmRule.
   */
  public static atLeastNotInsufficient(options: AtLeastOptions): IAlarmRule {
    const alarmState = `${Operator.NOT} ${AlarmState.INSUFFICIENT_DATA}`;
    return this.atLeast(alarmState, options);
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
          throw new UnscopedValidationError(`Did not detect any operands for AlarmRule.${operator === Operator.AND ? 'allOf' : 'anyOf'}()`);
        }

        const expression = operands
          .map(operand => `${operand.renderAlarmRule()}`)
          .join(` ${operator} `);
        return `(${expression})`;
      }
    };
  }

  private static atLeast(alarmState: string, props: AtLeastOptions): IAlarmRule {
    return new class implements IAlarmRule {
      public renderAlarmRule(): string {
        if (props.operands.length === 0) {
          throw new UnscopedValidationError(`Did not detect any operands for AT_LEAST ${alarmState}`);
        }

        const thresholdConfig = props.threshold._bind(props.operands);
        const concatAlarms = props.operands
          .map(operand => `${operand.alarmArn}`)
          .join(', ');

        return `AT_LEAST(${thresholdConfig.threshold}, ${alarmState}, (${concatAlarms}))`;
      }
    };
  }
}
