import { Duration } from '@aws-cdk/core';

//TODO: remove Abstract
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
   * Construct a schedule from a literal schedule expression. The expression must be in a `rate(number units)` format
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
    const minutes = duration.toMinutes();
    if (minutes === 0) {
      return Schedule.once();
    }
    if (minutes > 60) {
      throw new Error('Schedule duration must be between 1 and 60 minutes');
    }
    if (minutes === 1) {
      return new LiteralSchedule('rate(1 minute)');
    }
    return new LiteralSchedule(`rate(${minutes} minutes)`);
  }

  /**
   * Retrieve the expression for this schedule
   */
  public abstract readonly expressionString: string;
}

class LiteralSchedule extends Schedule {
  constructor(public readonly expressionString: string){
    super();
  }
}