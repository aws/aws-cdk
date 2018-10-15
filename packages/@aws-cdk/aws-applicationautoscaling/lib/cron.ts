/**
 * Helper class to generate Cron expressions
 */
export class Cron {

  /**
   * Return a cron expression to run every day at a particular time
   *
   * The time is specified in UTC.
   */
  public static dailyUtc(hour: number, minute?: number) {
    if (minute === undefined) {
      minute = 0;
    }
    // 3rd and 5th expression are mutually exclusive, one of them should be ?
    return `cron(${minute} ${hour} * * ?)`;
  }
}