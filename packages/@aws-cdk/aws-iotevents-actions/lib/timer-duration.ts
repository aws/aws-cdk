import * as iotevents from '@aws-cdk/aws-iotevents';
import { Duration } from '@aws-cdk/core';

/**
 * The duration of the timer.
 */
export abstract class TimerDuration {
  /**
   * Create a timer-duration from Duration.
   *
   * The range of the duration is 60-31622400 seconds.
   * The evaluated result of the duration expression is rounded down to the nearest whole number.
   * For example, if you set the timer to 60.99 seconds, the evaluated result of the duration expression is 60 seconds.
   */
  public static fromDuration(duration: Duration): TimerDuration {
    const seconds = duration.toSeconds();
    if (seconds < 60) {
      throw new Error(`duration cannot be less than 60 seconds, got: ${duration.toString()}`);
    }
    if (seconds > 31622400) {
      throw new Error(`duration cannot be greater than 31622400 seconds, got: ${duration.toString()}`);
    }
    return new TimerDurationImpl(seconds.toString());
  }

  /**
   * Create a timer-duration from Expression.
   *
   * You can use a string expression that includes numbers, variables ($variable.<variable-name>),
   * and input values ($input.<input-name>.<path-to-datum>) as the duration.
   *
   * The range of the duration is 60-31622400 seconds.
   * The evaluated result of the duration expression is rounded down to the nearest whole number.
   * For example, if you set the timer to 60.99 seconds, the evaluated result of the duration expression is 60 seconds.
   */
  public static fromExpression(expression: iotevents.Expression): TimerDuration {
    return new TimerDurationImpl(expression.evaluate());
  }

  /**
   * @internal
   */
  public abstract _bind(): string;
}

class TimerDurationImpl extends TimerDuration {
  constructor(private readonly durationExpression: string) {
    super();
  }

  public _bind() {
    return this.durationExpression;
  }
}
