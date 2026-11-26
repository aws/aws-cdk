import type { CfnAlarm } from './cloudwatch.generated';
import type { TimeZone } from '../../core';

/**
 * Options for a wall clock evaluation window
 */
export interface WallClockWindowOptions {
  /**
   * The time zone that determines where the clock boundaries fall.
   *
   * Use a predefined IANA zone (e.g. `TimeZone.AMERICA_NEW_YORK`), or `TimeZone.of()` for a
   * fixed UTC offset (`'+05:30'`, `'Z'`) or an offset-prefixed identifier (`'UTC+05:30'`,
   * `'GMT-08:00'`). The offset must be a multiple of 5 minutes. Only IANA zones follow daylight
   * saving time transitions; fixed offsets do not.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-evaluation-window.html#wall-clock-timezone
   *
   * @default - UTC
   */
  readonly timeZone?: TimeZone;
}

/**
 * The evaluation window an alarm uses to select the range of metric data it evaluates
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-evaluation-window.html
 */
export abstract class EvaluationWindow {
  /**
   * Evaluate the most recent data points as they arrive (the default behavior)
   *
   * The evaluated range slides forward continuously with the arrival of new data.
   * Omitting the evaluation window has the same effect.
   */
  public static slidingWindow(): EvaluationWindow {
    return new SlidingWindow();
  }

  /**
   * Align the evaluated range to fixed clock boundaries that match the alarm's period
   *
   * For example the top of the hour, midnight, or the start of the calendar week, in the
   * given time zone (UTC by default). Choose a wall clock window when monitoring is tied to
   * a business or calendar period.
   *
   * When a wall clock window is used, all metric periods must be one of:
   * 1 minute, 5 minutes, 1 hour, 1 day, or 1 week. For Metrics Insights alarms,
   * CloudWatch reserves one extra period to align the window, so
   * `period x (evaluationPeriods + 1)` must be 3 hours or less.
   */
  public static wallClockWindow(options: WallClockWindowOptions = {}): EvaluationWindow {
    return new WallClockWindow(options);
  }

  /**
   * Whether this is a wall clock window
   *
   * @internal
   */
  public abstract readonly _isWallClockWindow: boolean;

  /**
   * Render the CfnAlarm evaluation window union
   *
   * @internal
   */
  public abstract _render(): CfnAlarm.EvaluationWindowProperty;
}

class SlidingWindow extends EvaluationWindow {
  public readonly _isWallClockWindow = false;

  public _render(): CfnAlarm.EvaluationWindowProperty {
    return { slidingWindow: {} };
  }
}

class WallClockWindow extends EvaluationWindow {
  public readonly _isWallClockWindow = true;

  constructor(private readonly options: WallClockWindowOptions) {
    super();
  }

  public _render(): CfnAlarm.EvaluationWindowProperty {
    return { wallClockWindow: { timezone: this.options.timeZone?.timezoneName } };
  }
}
