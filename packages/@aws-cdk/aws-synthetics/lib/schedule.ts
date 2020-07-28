import { Duration } from '@aws-cdk/core';

/**
 * Schedule for canary runs
 */
export abstract class Schedule {

  /**
   * Construct a schedule that runs the canary once.
   */
  public static once(): Schedule {
    return new LiteralSchedule('rate(0 minutes)');
  }

  /**
   * Construct a schedule from a literal schedule expression. Must be in a format that Synthetics will recognize.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-schedule.html
   *
   * @param expression The expression to use.
   */
  public static expression(expression: string): Schedule {
    return new LiteralSchedule(expression);
  }

  /**
   * Construct a schedule from an interval. Allowed values: 0 (for a single run) or between 1 and 60 minutes.
   */
  public static rate(duration: Duration): Schedule {
    if (duration.toMinutes() === 0) {
      return new LiteralSchedule('rate(0 minutes)');
    }
    if (duration.toMinutes() < 1 || duration.toMinutes() > 60) {
      throw new Error('Schedule duration must be either 0 (for a single run) or between 1 and 60 minutes');
    }
    if (duration.toMinutes() === 1) {
      return new LiteralSchedule('rate(1 minute)');
    }
    return new LiteralSchedule(`rate(${duration.toMinutes()} minutes)`);
  }

  /**
   * Retrieve the expression for this schedule
   */
  public abstract readonly expressionString: string;

  constructor() {}
}

class LiteralSchedule extends Schedule {
  constructor(public readonly expressionString: string){
    super();
  }
}