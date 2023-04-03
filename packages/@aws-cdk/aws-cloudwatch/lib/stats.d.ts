/**
 * Factory functions for standard statistics strings
 */
export declare abstract class Stats {
    /**
     * The count (number) of data points used for the statistical calculation.
     */
    static readonly SAMPLE_COUNT = "SampleCount";
    /**
     * The value of Sum / SampleCount during the specified period.
     */
    static readonly AVERAGE = "Average";
    /**
     * All values submitted for the matching metric added together.
     * This statistic can be useful for determining the total volume of a metric.
     */
    static readonly SUM = "Sum";
    /**
     * The lowest value observed during the specified period.
     * You can use this value to determine low volumes of activity for your application.
     */
    static readonly MINIMUM = "Minimum";
    /**
     * The highest value observed during the specified period.
     * You can use this value to determine high volumes of activity for your application.
     */
    static readonly MAXIMUM = "Maximum";
    /**
     * Interquartile mean (IQM) is the trimmed mean of the interquartile range, or the middle 50% of values.
     *
     * It is equivalent to `trimmedMean(25, 75)`.
     */
    static readonly IQM = "IQM";
    /**
     * Percentile indicates the relative standing of a value in a dataset.
     *
     * Percentiles help you get a better understanding of the distribution of your metric data.
     *
     * For example, `p(90)` is the 90th percentile and means that 90% of the data
     * within the period is lower than this value and 10% of the data is higher
     * than this value.
     */
    static percentile(percentile: number): string;
    /**
     * A shorter alias for `percentile()`.
     */
    static p(percentile: number): string;
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
    static trimmedMean(p1: number, p2?: number): string;
    /**
     * A shorter alias for `trimmedMean()`.
     */
    static tm(p1: number, p2?: number): string;
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
    static winsorizedMean(p1: number, p2?: number): string;
    /**
     * A shorter alias for `winsorizedMean()`.
     */
    static wm(p1: number, p2?: number): string;
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
    static trimmedCount(p1: number, p2?: number): string;
    /**
     * Shorter alias for `trimmedCount()`.
     */
    static tc(p1: number, p2?: number): string;
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
    static trimmedSum(p1: number, p2?: number): string;
    /**
     * Shorter alias for `trimmedSum()`.
     */
    static ts(p1: number, p2?: number): string;
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
    static percentileRank(v1: number, v2?: number): string;
    /**
     * Shorter alias for `percentileRank()`.
     */
    static pr(v1: number, v2?: number): string;
}
