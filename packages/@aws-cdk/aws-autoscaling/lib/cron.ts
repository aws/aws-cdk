/**
 * Helper class to generate Cron expressions
 */
export class Cron {

  /**
   * Return a cron expression to run every day at a particular time
   *
   * The time is specified in UTC.
   *
   * @param hour The hour in UTC to schedule this action
   * @param minute The minute in the our to schedule this action (defaults to 0)
   */
  public static dailyUtc(hour: number, minute?: number) {
    minute = minute || 0;
    // 3rd and 5th expression are mutually exclusive, one of them should be ?
    return `${minute} ${hour} * * ?`;
  }
}
