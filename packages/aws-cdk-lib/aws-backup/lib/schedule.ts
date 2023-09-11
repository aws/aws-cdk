import { CronOptions, Schedule as ScheduleExpression } from '../../core/lib/helpers-internal';

export abstract class Schedule extends ScheduleExpression {
  public static cron(options: CronOptions): Schedule {
    return super.protectedCron(options);
  }
}
