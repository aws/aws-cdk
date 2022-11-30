
/**
 * Factory functions for standard statistics strings
 */
export abstract class Stats {
  /**
   * The count (number) of data points used for the statistical calculation.
   */
  public static readonly SAMPLE_COUNT = 'SampleCount';

  /**
   * The value of Sum / SampleCount during the specified period.
   */
  public static readonly AVERAGE = 'Average';
  /**
   * All values submitted for the matching metric added together.
   * This statistic can be useful for determining the total volume of a metric.
   */
  public static readonly SUM = 'Sum';

  /**
   * The lowest value observed during the specified period.
   * You can use this value to determine low volumes of activity for your application.
   */
  public static readonly MINIMUM = 'Minimum';

  /**
   * The highest value observed during the specified period.
   * You can use this value to determine high volumes of activity for your application.
   */
  public static readonly MAXIMUM = 'Maximum';

  /**
   * Interquartile mean (IQM) is the trimmed mean of the interquartile range, or the middle 50% of values.
   *
   * It is equivalent to `trimmedMean(25, 75)`.
   */
  public static readonly IQM = 'IQM';

  /**
   * Percentile indicates the relative standing of a value in a dataset.
   *
   * Percentiles help you get a better understanding of the distribution of your metric data.
   *
   * For example, `p(90)` is the 90th percentile and means that 90% of the data
   * within the period is lower than this value and 10% of the data is higher
   * than this value.
   */
  public static percentile(percentile: number) {
    assertPercentage(percentile);
    return `p${percentile}`;
  }

  /**
   * A shorter alias for `percentile()`.
   */
  public static p(percentile: number) {
    return Stats.percentile(percentile);
  }

  /**
   * Trimmed mean (TM) is the mean of all values that are between two specified boundaries.
   *
   * Values outside of the boundaries are ignored when the mean is calculated.
   * You define the boundaries as one or two numbers between 0 and 100, up to 10
   * decimal places. The numbers are percentages.
   *
   * - If two numbers are given, they define the lower and upper bounds in percentages,
   *   respectively.
   * - If one number is given, it defines the upper bound (the lower bound is assumed to
   *   be 0).
   *
   * For example, `tm(90)` calculates the average after removing the 10% of data
   * points with the highest values; `tm(10, 90)` calculates the average after removing the
   * 10% with the lowest and 10% with the highest values.
   */
  public static trimmedMean(p1: number, p2?: number) {
    return boundaryPercentileStat('tm', 'TM', p1, p2);
  }

  /**
   * A shorter alias for `trimmedMean()`.
   */
  public static tm(p1: number, p2?: number) {
    return Stats.trimmedMean(p1, p2);
  }

  /**
   * Winsorized mean (WM) is similar to trimmed mean.
   *
   * However, with winsorized mean, the values that are outside the boundary are
   * not ignored, but instead are considered to be equal to the value at the
   * edge of the appropriate boundary.  After this normalization, the average is
   * calculated. You define the boundaries as one or two numbers between 0 and
   * 100, up to 10 decimal places.
   *
   * - If two numbers are given, they define the lower and upper bounds in percentages,
   *   respectively.
   * - If one number is given, it defines the upper bound (the lower bound is assumed to
   *   be 0).
   *
   * For example, `tm(90)` calculates the average after removing the 10% of data
   * points with the highest values; `tm(10, 90)` calculates the average after removing the
   * 10% with the lowest and 10% with the highest values.
   *
   * For example, `wm(90)` calculates the average while treating the 10% of the
   * highest values to be equal to the value at the 90th percentile.
   * `wm(10, 90)` calculates the average while treaing the bottom 10% and the
   * top 10% of values to be equal to the boundary values.
   */
  public static winsorizedMean(p1: number, p2?: number) {
    return boundaryPercentileStat('wm', 'WM', p1, p2);
  }

  /**
   * A shorter alias for `winsorizedMean()`.
   */
  public static wm(p1: number, p2?: number) {
    return Stats.winsorizedMean(p1, p2);
  }

  /**
   * Trimmed count (TC) is the number of data points in the chosen range for a trimmed mean statistic.
   *
   * - If two numbers are given, they define the lower and upper bounds in percentages,
   *   respectively.
   * - If one number is given, it defines the upper bound (the lower bound is assumed to
   *   be 0).
   *
   * For example, `tc(90)` returns the number of data points not including any
   * data points that fall in the highest 10% of the values. `tc(10, 90)`
   * returns the number of data points not including any data points that fall
   * in the lowest 10% of the values and the highest 90% of the values.
   */
  public static trimmedCount(p1: number, p2?: number) {
    return boundaryPercentileStat('tc', 'TC', p1, p2);
  }

  /**
   * Shorter alias for `trimmedCount()`.
   */
  public static tc(p1: number, p2?: number) {
    return Stats.trimmedCount(p1, p2);
  }

  /**
   * Trimmed sum (TS) is the sum of the values of data points in a chosen range for a trimmed mean statistic.
   * It is equivalent to `(Trimmed Mean) * (Trimmed count)`.
   *
   * - If two numbers are given, they define the lower and upper bounds in percentages,
   *   respectively.
   * - If one number is given, it defines the upper bound (the lower bound is assumed to
   *   be 0).
   *
   * For example, `ts(90)` returns the sum of the data points not including any
   * data points that fall in the highest 10% of the values.  `ts(10, 90)`
   * returns the sum of the data points not including any data points that fall
   * in the lowest 10% of the values and the highest 90% of the values.
   */
  public static trimmedSum(p1: number, p2?: number) {
    return boundaryPercentileStat('ts', 'TS', p1, p2);
  }

  /**
   * Shorter alias for `trimmedSum()`.
   */
  public static ts(p1: number, p2?: number) {
    return Stats.trimmedSum(p1, p2);
  }

  /**
   * Percentile rank (PR) is the percentage of values that meet a fixed threshold.
   *
   * - If two numbers are given, they define the lower and upper bounds in absolute values,
   *   respectively.
   * - If one number is given, it defines the upper bound (the lower bound is assumed to
   *   be 0).
   *
   * For example, `percentileRank(300)` returns the percentage of data points that have a value of 300 or less.
   * `percentileRank(100, 2000)` returns the percentage of data points that have a value between 100 and 2000.
   */
  public static percentileRank(v1: number, v2?: number) {
    if (v2 !== undefined) {
      return `PR(${v1}:${v2})`;
    } else {
      return `PR(:${v1})`;
    }
  }

  /**
   * Shorter alias for `percentileRank()`.
   */
  public static pr(v1: number, v2?: number) {
    return this.percentileRank(v1, v2);
  }
}

function assertPercentage(x?: number) {
  if (x !== undefined && (x < 0 || x > 100)) {
    throw new Error(`Expecting a percentage, got: ${x}`);
  }
}

/**
 * Formatting helper because all these stats look the same
 */
function boundaryPercentileStat(oneBoundaryStat: string, twoBoundaryStat: string, p1: number, p2: number | undefined) {
  assertPercentage(p1);
  assertPercentage(p2);
  if (p2 !== undefined) {
    return `${twoBoundaryStat}(${p1}%:${p2}%)`;
  } else {
    return `${oneBoundaryStat}${p1}`;
  }
}