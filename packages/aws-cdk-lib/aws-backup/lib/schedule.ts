import { CronOptions, Schedule as ScheduleExpression } from '../../core';

export abstract class Schedule extends ScheduleExpression {
  public static cron(options: CronOptions): Schedule {
    return super.cron(options);
  }
}
