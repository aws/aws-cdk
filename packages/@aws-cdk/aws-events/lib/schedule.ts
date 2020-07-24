import { BaseSchedule, CronOptions, Duration} from '@aws-cdk/core';

/**
 * Schedule for scheduled event rules
 */
export abstract class Schedule extends BaseSchedule {
  /**
   * Construct a schedule from a literal schedule expression
   *
   * @param expression The expression to use. Must be in a format that EventBridge will recognize
   */
  public static expression(expression: string): Schedule {
    return super.createExpression(expression);
  }

  /**
   * Construct a schedule from an interval and a time unit
   */
  public static rate(duration: Duration): Schedule {
    return super.createRate(duration);
  }

  /**
   * Create a schedule from a set of cron fields
   */
  public static cron(options: CronOptions): Schedule {
    return super.createCron(options);
  }
}
