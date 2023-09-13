import { CronOptions, Schedule as CoreSchedule, TimeZone } from '../../core';

export abstract class Schedule extends CoreSchedule {
  /**
   * Construct a schedule from a literal schedule expression
   *
   * @param expression The expression to use. Must be in a format that AWS Backup will recognize
   */
  public static expression(expression: string, timeZone?: TimeZone): Schedule {
    return super.protectedExpression(expression, timeZone);
  }

  /**
   * Construct a schedule from cron options
   */
  public static cron(options: CronOptions): Schedule {
    return super.protectedCron(options);
  }
}
