import { BaseSchedule, CronOptions } from '@aws-cdk/core';

/**
 * Schedule for scheduled scaling actions
 */
export abstract class Schedule extends BaseSchedule {
  /**
   * Construct a schedule from a literal schedule expression
   *
   * @param expression The expression to use. Must be in a format that AutoScaling will recognize
   * @see http://crontab.org/
   */
  public static expression(expression: string): Schedule {
    return super.createExpression(expression);
  }

  /**
   * Create a schedule from a set of cron fields
   */
  public static cron(options: CronOptions): Schedule {
    return super.createCron(options, true);
  }
}
