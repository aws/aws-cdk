import { Annotations } from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Schedule for scheduled scaling actions
 */
export abstract class Schedule {
  /**
   * Construct a schedule from a literal schedule expression
   *
   * @param expression The expression to use. Must be in a format that AutoScaling will recognize
   * @see http://crontab.org/
   */
  public static expression(expression: string): Schedule {
    return new LiteralSchedule(expression);
  }

  /**
   * Create a schedule from a set of cron fields
   */
  public static cron(options: CronOptions): Schedule {
    if (options.weekDay !== undefined && options.day !== undefined) {
      throw new Error('Cannot supply both \'day\' and \'weekDay\', use at most one');
    }

    const minute = fallback(options.minute, '*');
    const hour = fallback(options.hour, '*');
    const month = fallback(options.month, '*');
    const day = fallback(options.day, '*');
    const weekDay = fallback(options.weekDay, '*');

    return new class extends Schedule {
      public readonly expressionString: string = `${minute} ${hour} ${day} ${month} ${weekDay}`;
      public _bind(scope: Construct) {
        if (!options.minute) {
          Annotations.of(scope).addWarning('cron: If you don\'t pass \'minute\', by default the event runs every minute. Pass \'minute: \'*\'\' if that\'s what you intend, or \'minute: 0\' to run once per hour instead.');
        }
        return new LiteralSchedule(this.expressionString);
      }
    };
  }

  /**
   * Retrieve the expression for this schedule
   */
  public abstract readonly expressionString: string;

  protected constructor() {}

  /**
   *
   * @internal
   */
  public abstract _bind(scope: Construct): void;
}

/**
 * Options to configure a cron expression
 *
 * All fields are strings so you can use complex expressions. Absence of
 * a field implies '*' or '?', whichever one is appropriate.
 *
 * @see http://crontab.org/
 */
export interface CronOptions {
  /**
   * The minute to run this rule at
   *
   * @default - Every minute
   */
  readonly minute?: string;

  /**
   * The hour to run this rule at
   *
   * @default - Every hour
   */
  readonly hour?: string;

  /**
   * The day of the month to run this rule at
   *
   * @default - Every day of the month
   */
  readonly day?: string;

  /**
   * The month to run this rule at
   *
   * @default - Every month
   */
  readonly month?: string;

  /**
   * The day of the week to run this rule at
   *
   * @default - Any day of the week
   */
  readonly weekDay?: string;
}

class LiteralSchedule extends Schedule {
  constructor(public readonly expressionString: string) {
    super();
  }

  public _bind(): void {}
}

function fallback<T>(x: T | undefined, def: T): T {
  return x === undefined ? def : x;
}
