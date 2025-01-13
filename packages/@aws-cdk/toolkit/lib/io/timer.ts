import { formatTime } from 'aws-cdk/lib/api/util/string-manipulation';

/**
 * Helper class to measure the time of code.
 */
export class Timer {
  /**
   * Start the timer.
   * @return the timer instance
   */
  public static start(): Timer {
    return new Timer();
  }

  private readonly startTime: number;

  private constructor() {
    this.startTime = new Date().getTime();
  }

  /**
   * End the current timer.
   * @returns the elapsed time
   */
  public end() {
    const elapsedTime = new Date().getTime() - this.startTime;
    return {
      asMs: elapsedTime,
      asSec: formatTime(elapsedTime),
    };
  }
}
