"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Factory functions for standard statistics strings
 */
class Stats {
    /**
     * Percentile indicates the relative standing of a value in a dataset.
     *
     * Percentiles help you get a better understanding of the distribution of your metric data.
     *
     * For example, `p(90)` is the 90th percentile and means that 90% of the data
     * within the period is lower than this value and 10% of the data is higher
     * than this value.
     */
    static percentile(percentile) {
        assertPercentage(percentile);
        return `p${percentile}`;
    }
    /**
     * A shorter alias for `percentile()`.
     */
    static p(percentile) {
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
    static trimmedMean(p1, p2) {
        return boundaryPercentileStat('tm', 'TM', p1, p2);
    }
    /**
     * A shorter alias for `trimmedMean()`.
     */
    static tm(p1, p2) {
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
    static winsorizedMean(p1, p2) {
        return boundaryPercentileStat('wm', 'WM', p1, p2);
    }
    /**
     * A shorter alias for `winsorizedMean()`.
     */
    static wm(p1, p2) {
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
    static trimmedCount(p1, p2) {
        return boundaryPercentileStat('tc', 'TC', p1, p2);
    }
    /**
     * Shorter alias for `trimmedCount()`.
     */
    static tc(p1, p2) {
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
    static trimmedSum(p1, p2) {
        return boundaryPercentileStat('ts', 'TS', p1, p2);
    }
    /**
     * Shorter alias for `trimmedSum()`.
     */
    static ts(p1, p2) {
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
    static percentileRank(v1, v2) {
        if (v2 !== undefined) {
            return `PR(${v1}:${v2})`;
        }
        else {
            return `PR(:${v1})`;
        }
    }
    /**
     * Shorter alias for `percentileRank()`.
     */
    static pr(v1, v2) {
        return this.percentileRank(v1, v2);
    }
}
_a = JSII_RTTI_SYMBOL_1;
Stats[_a] = { fqn: "@aws-cdk/aws-cloudwatch.Stats", version: "0.0.0" };
/**
 * The count (number) of data points used for the statistical calculation.
 */
Stats.SAMPLE_COUNT = 'SampleCount';
/**
 * The value of Sum / SampleCount during the specified period.
 */
Stats.AVERAGE = 'Average';
/**
 * All values submitted for the matching metric added together.
 * This statistic can be useful for determining the total volume of a metric.
 */
Stats.SUM = 'Sum';
/**
 * The lowest value observed during the specified period.
 * You can use this value to determine low volumes of activity for your application.
 */
Stats.MINIMUM = 'Minimum';
/**
 * The highest value observed during the specified period.
 * You can use this value to determine high volumes of activity for your application.
 */
Stats.MAXIMUM = 'Maximum';
/**
 * Interquartile mean (IQM) is the trimmed mean of the interquartile range, or the middle 50% of values.
 *
 * It is equivalent to `trimmedMean(25, 75)`.
 */
Stats.IQM = 'IQM';
exports.Stats = Stats;
function assertPercentage(x) {
    if (x !== undefined && (x < 0 || x > 100)) {
        throw new Error(`Expecting a percentage, got: ${x}`);
    }
}
/**
 * Formatting helper because all these stats look the same
 */
function boundaryPercentileStat(oneBoundaryStat, twoBoundaryStat, p1, p2) {
    assertPercentage(p1);
    assertPercentage(p2);
    if (p2 !== undefined) {
        return `${twoBoundaryStat}(${p1}%:${p2}%)`;
    }
    else {
        return `${oneBoundaryStat}${p1}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBOztHQUVHO0FBQ0gsTUFBc0IsS0FBSztJQW1DekI7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQWtCO1FBQ3pDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQztLQUN6QjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFrQjtRQUNoQyxPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDckM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQVUsRUFBRSxFQUFXO1FBQy9DLE9BQU8sc0JBQXNCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDbkQ7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBVSxFQUFFLEVBQVc7UUFDdEMsT0FBTyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNsQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bc0JHO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFVLEVBQUUsRUFBVztRQUNsRCxPQUFPLHNCQUFzQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ25EO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQVUsRUFBRSxFQUFXO1FBQ3RDLE9BQU8sS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDckM7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQVUsRUFBRSxFQUFXO1FBQ2hELE9BQU8sc0JBQXNCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDbkQ7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBVSxFQUFFLEVBQVc7UUFDdEMsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNuQztJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQVUsRUFBRSxFQUFXO1FBQzlDLE9BQU8sc0JBQXNCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDbkQ7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBVSxFQUFFLEVBQVc7UUFDdEMsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNqQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSSxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQVUsRUFBRSxFQUFXO1FBQ2xELElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtZQUNwQixPQUFPLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDO1NBQzFCO2FBQU07WUFDTCxPQUFPLE9BQU8sRUFBRSxHQUFHLENBQUM7U0FDckI7S0FDRjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFVLEVBQUUsRUFBVztRQUN0QyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3BDOzs7O0FBN0xEOztHQUVHO0FBQ29CLGtCQUFZLEdBQUcsYUFBYSxDQUFDO0FBRXBEOztHQUVHO0FBQ29CLGFBQU8sR0FBRyxTQUFTLENBQUM7QUFDM0M7OztHQUdHO0FBQ29CLFNBQUcsR0FBRyxLQUFLLENBQUM7QUFFbkM7OztHQUdHO0FBQ29CLGFBQU8sR0FBRyxTQUFTLENBQUM7QUFFM0M7OztHQUdHO0FBQ29CLGFBQU8sR0FBRyxTQUFTLENBQUM7QUFFM0M7Ozs7R0FJRztBQUNvQixTQUFHLEdBQUcsS0FBSyxDQUFDO0FBakNmLHNCQUFLO0FBaU0zQixTQUFTLGdCQUFnQixDQUFDLENBQVU7SUFDbEMsSUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUU7UUFDekMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN0RDtBQUNILENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsc0JBQXNCLENBQUMsZUFBdUIsRUFBRSxlQUF1QixFQUFFLEVBQVUsRUFBRSxFQUFzQjtJQUNsSCxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUU7UUFDcEIsT0FBTyxHQUFHLGVBQWUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUM7S0FDNUM7U0FBTTtRQUNMLE9BQU8sR0FBRyxlQUFlLEdBQUcsRUFBRSxFQUFFLENBQUM7S0FDbEM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIEZhY3RvcnkgZnVuY3Rpb25zIGZvciBzdGFuZGFyZCBzdGF0aXN0aWNzIHN0cmluZ3NcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN0YXRzIHtcbiAgLyoqXG4gICAqIFRoZSBjb3VudCAobnVtYmVyKSBvZiBkYXRhIHBvaW50cyB1c2VkIGZvciB0aGUgc3RhdGlzdGljYWwgY2FsY3VsYXRpb24uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFNBTVBMRV9DT1VOVCA9ICdTYW1wbGVDb3VudCc7XG5cbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSBvZiBTdW0gLyBTYW1wbGVDb3VudCBkdXJpbmcgdGhlIHNwZWNpZmllZCBwZXJpb2QuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFWRVJBR0UgPSAnQXZlcmFnZSc7XG4gIC8qKlxuICAgKiBBbGwgdmFsdWVzIHN1Ym1pdHRlZCBmb3IgdGhlIG1hdGNoaW5nIG1ldHJpYyBhZGRlZCB0b2dldGhlci5cbiAgICogVGhpcyBzdGF0aXN0aWMgY2FuIGJlIHVzZWZ1bCBmb3IgZGV0ZXJtaW5pbmcgdGhlIHRvdGFsIHZvbHVtZSBvZiBhIG1ldHJpYy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU1VNID0gJ1N1bSc7XG5cbiAgLyoqXG4gICAqIFRoZSBsb3dlc3QgdmFsdWUgb2JzZXJ2ZWQgZHVyaW5nIHRoZSBzcGVjaWZpZWQgcGVyaW9kLlxuICAgKiBZb3UgY2FuIHVzZSB0aGlzIHZhbHVlIHRvIGRldGVybWluZSBsb3cgdm9sdW1lcyBvZiBhY3Rpdml0eSBmb3IgeW91ciBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTUlOSU1VTSA9ICdNaW5pbXVtJztcblxuICAvKipcbiAgICogVGhlIGhpZ2hlc3QgdmFsdWUgb2JzZXJ2ZWQgZHVyaW5nIHRoZSBzcGVjaWZpZWQgcGVyaW9kLlxuICAgKiBZb3UgY2FuIHVzZSB0aGlzIHZhbHVlIHRvIGRldGVybWluZSBoaWdoIHZvbHVtZXMgb2YgYWN0aXZpdHkgZm9yIHlvdXIgYXBwbGljYXRpb24uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1BWElNVU0gPSAnTWF4aW11bSc7XG5cbiAgLyoqXG4gICAqIEludGVycXVhcnRpbGUgbWVhbiAoSVFNKSBpcyB0aGUgdHJpbW1lZCBtZWFuIG9mIHRoZSBpbnRlcnF1YXJ0aWxlIHJhbmdlLCBvciB0aGUgbWlkZGxlIDUwJSBvZiB2YWx1ZXMuXG4gICAqXG4gICAqIEl0IGlzIGVxdWl2YWxlbnQgdG8gYHRyaW1tZWRNZWFuKDI1LCA3NSlgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBJUU0gPSAnSVFNJztcblxuICAvKipcbiAgICogUGVyY2VudGlsZSBpbmRpY2F0ZXMgdGhlIHJlbGF0aXZlIHN0YW5kaW5nIG9mIGEgdmFsdWUgaW4gYSBkYXRhc2V0LlxuICAgKlxuICAgKiBQZXJjZW50aWxlcyBoZWxwIHlvdSBnZXQgYSBiZXR0ZXIgdW5kZXJzdGFuZGluZyBvZiB0aGUgZGlzdHJpYnV0aW9uIG9mIHlvdXIgbWV0cmljIGRhdGEuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBgcCg5MClgIGlzIHRoZSA5MHRoIHBlcmNlbnRpbGUgYW5kIG1lYW5zIHRoYXQgOTAlIG9mIHRoZSBkYXRhXG4gICAqIHdpdGhpbiB0aGUgcGVyaW9kIGlzIGxvd2VyIHRoYW4gdGhpcyB2YWx1ZSBhbmQgMTAlIG9mIHRoZSBkYXRhIGlzIGhpZ2hlclxuICAgKiB0aGFuIHRoaXMgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHBlcmNlbnRpbGUocGVyY2VudGlsZTogbnVtYmVyKSB7XG4gICAgYXNzZXJ0UGVyY2VudGFnZShwZXJjZW50aWxlKTtcbiAgICByZXR1cm4gYHAke3BlcmNlbnRpbGV9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNob3J0ZXIgYWxpYXMgZm9yIGBwZXJjZW50aWxlKClgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwKHBlcmNlbnRpbGU6IG51bWJlcikge1xuICAgIHJldHVybiBTdGF0cy5wZXJjZW50aWxlKHBlcmNlbnRpbGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaW1tZWQgbWVhbiAoVE0pIGlzIHRoZSBtZWFuIG9mIGFsbCB2YWx1ZXMgdGhhdCBhcmUgYmV0d2VlbiB0d28gc3BlY2lmaWVkIGJvdW5kYXJpZXMuXG4gICAqXG4gICAqIFZhbHVlcyBvdXRzaWRlIG9mIHRoZSBib3VuZGFyaWVzIGFyZSBpZ25vcmVkIHdoZW4gdGhlIG1lYW4gaXMgY2FsY3VsYXRlZC5cbiAgICogWW91IGRlZmluZSB0aGUgYm91bmRhcmllcyBhcyBvbmUgb3IgdHdvIG51bWJlcnMgYmV0d2VlbiAwIGFuZCAxMDAsIHVwIHRvIDEwXG4gICAqIGRlY2ltYWwgcGxhY2VzLiBUaGUgbnVtYmVycyBhcmUgcGVyY2VudGFnZXMuXG4gICAqXG4gICAqIC0gSWYgdHdvIG51bWJlcnMgYXJlIGdpdmVuLCB0aGV5IGRlZmluZSB0aGUgbG93ZXIgYW5kIHVwcGVyIGJvdW5kcyBpbiBwZXJjZW50YWdlcyxcbiAgICogICByZXNwZWN0aXZlbHkuXG4gICAqIC0gSWYgb25lIG51bWJlciBpcyBnaXZlbiwgaXQgZGVmaW5lcyB0aGUgdXBwZXIgYm91bmQgKHRoZSBsb3dlciBib3VuZCBpcyBhc3N1bWVkIHRvXG4gICAqICAgYmUgMCkuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBgdG0oOTApYCBjYWxjdWxhdGVzIHRoZSBhdmVyYWdlIGFmdGVyIHJlbW92aW5nIHRoZSAxMCUgb2YgZGF0YVxuICAgKiBwb2ludHMgd2l0aCB0aGUgaGlnaGVzdCB2YWx1ZXM7IGB0bSgxMCwgOTApYCBjYWxjdWxhdGVzIHRoZSBhdmVyYWdlIGFmdGVyIHJlbW92aW5nIHRoZVxuICAgKiAxMCUgd2l0aCB0aGUgbG93ZXN0IGFuZCAxMCUgd2l0aCB0aGUgaGlnaGVzdCB2YWx1ZXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRyaW1tZWRNZWFuKHAxOiBudW1iZXIsIHAyPzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGJvdW5kYXJ5UGVyY2VudGlsZVN0YXQoJ3RtJywgJ1RNJywgcDEsIHAyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNob3J0ZXIgYWxpYXMgZm9yIGB0cmltbWVkTWVhbigpYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdG0ocDE6IG51bWJlciwgcDI/OiBudW1iZXIpIHtcbiAgICByZXR1cm4gU3RhdHMudHJpbW1lZE1lYW4ocDEsIHAyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaW5zb3JpemVkIG1lYW4gKFdNKSBpcyBzaW1pbGFyIHRvIHRyaW1tZWQgbWVhbi5cbiAgICpcbiAgICogSG93ZXZlciwgd2l0aCB3aW5zb3JpemVkIG1lYW4sIHRoZSB2YWx1ZXMgdGhhdCBhcmUgb3V0c2lkZSB0aGUgYm91bmRhcnkgYXJlXG4gICAqIG5vdCBpZ25vcmVkLCBidXQgaW5zdGVhZCBhcmUgY29uc2lkZXJlZCB0byBiZSBlcXVhbCB0byB0aGUgdmFsdWUgYXQgdGhlXG4gICAqIGVkZ2Ugb2YgdGhlIGFwcHJvcHJpYXRlIGJvdW5kYXJ5LiAgQWZ0ZXIgdGhpcyBub3JtYWxpemF0aW9uLCB0aGUgYXZlcmFnZSBpc1xuICAgKiBjYWxjdWxhdGVkLiBZb3UgZGVmaW5lIHRoZSBib3VuZGFyaWVzIGFzIG9uZSBvciB0d28gbnVtYmVycyBiZXR3ZWVuIDAgYW5kXG4gICAqIDEwMCwgdXAgdG8gMTAgZGVjaW1hbCBwbGFjZXMuXG4gICAqXG4gICAqIC0gSWYgdHdvIG51bWJlcnMgYXJlIGdpdmVuLCB0aGV5IGRlZmluZSB0aGUgbG93ZXIgYW5kIHVwcGVyIGJvdW5kcyBpbiBwZXJjZW50YWdlcyxcbiAgICogICByZXNwZWN0aXZlbHkuXG4gICAqIC0gSWYgb25lIG51bWJlciBpcyBnaXZlbiwgaXQgZGVmaW5lcyB0aGUgdXBwZXIgYm91bmQgKHRoZSBsb3dlciBib3VuZCBpcyBhc3N1bWVkIHRvXG4gICAqICAgYmUgMCkuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBgdG0oOTApYCBjYWxjdWxhdGVzIHRoZSBhdmVyYWdlIGFmdGVyIHJlbW92aW5nIHRoZSAxMCUgb2YgZGF0YVxuICAgKiBwb2ludHMgd2l0aCB0aGUgaGlnaGVzdCB2YWx1ZXM7IGB0bSgxMCwgOTApYCBjYWxjdWxhdGVzIHRoZSBhdmVyYWdlIGFmdGVyIHJlbW92aW5nIHRoZVxuICAgKiAxMCUgd2l0aCB0aGUgbG93ZXN0IGFuZCAxMCUgd2l0aCB0aGUgaGlnaGVzdCB2YWx1ZXMuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBgd20oOTApYCBjYWxjdWxhdGVzIHRoZSBhdmVyYWdlIHdoaWxlIHRyZWF0aW5nIHRoZSAxMCUgb2YgdGhlXG4gICAqIGhpZ2hlc3QgdmFsdWVzIHRvIGJlIGVxdWFsIHRvIHRoZSB2YWx1ZSBhdCB0aGUgOTB0aCBwZXJjZW50aWxlLlxuICAgKiBgd20oMTAsIDkwKWAgY2FsY3VsYXRlcyB0aGUgYXZlcmFnZSB3aGlsZSB0cmVhaW5nIHRoZSBib3R0b20gMTAlIGFuZCB0aGVcbiAgICogdG9wIDEwJSBvZiB2YWx1ZXMgdG8gYmUgZXF1YWwgdG8gdGhlIGJvdW5kYXJ5IHZhbHVlcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgd2luc29yaXplZE1lYW4ocDE6IG51bWJlciwgcDI/OiBudW1iZXIpIHtcbiAgICByZXR1cm4gYm91bmRhcnlQZXJjZW50aWxlU3RhdCgnd20nLCAnV00nLCBwMSwgcDIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc2hvcnRlciBhbGlhcyBmb3IgYHdpbnNvcml6ZWRNZWFuKClgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB3bShwMTogbnVtYmVyLCBwMj86IG51bWJlcikge1xuICAgIHJldHVybiBTdGF0cy53aW5zb3JpemVkTWVhbihwMSwgcDIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaW1tZWQgY291bnQgKFRDKSBpcyB0aGUgbnVtYmVyIG9mIGRhdGEgcG9pbnRzIGluIHRoZSBjaG9zZW4gcmFuZ2UgZm9yIGEgdHJpbW1lZCBtZWFuIHN0YXRpc3RpYy5cbiAgICpcbiAgICogLSBJZiB0d28gbnVtYmVycyBhcmUgZ2l2ZW4sIHRoZXkgZGVmaW5lIHRoZSBsb3dlciBhbmQgdXBwZXIgYm91bmRzIGluIHBlcmNlbnRhZ2VzLFxuICAgKiAgIHJlc3BlY3RpdmVseS5cbiAgICogLSBJZiBvbmUgbnVtYmVyIGlzIGdpdmVuLCBpdCBkZWZpbmVzIHRoZSB1cHBlciBib3VuZCAodGhlIGxvd2VyIGJvdW5kIGlzIGFzc3VtZWQgdG9cbiAgICogICBiZSAwKS5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGB0Yyg5MClgIHJldHVybnMgdGhlIG51bWJlciBvZiBkYXRhIHBvaW50cyBub3QgaW5jbHVkaW5nIGFueVxuICAgKiBkYXRhIHBvaW50cyB0aGF0IGZhbGwgaW4gdGhlIGhpZ2hlc3QgMTAlIG9mIHRoZSB2YWx1ZXMuIGB0YygxMCwgOTApYFxuICAgKiByZXR1cm5zIHRoZSBudW1iZXIgb2YgZGF0YSBwb2ludHMgbm90IGluY2x1ZGluZyBhbnkgZGF0YSBwb2ludHMgdGhhdCBmYWxsXG4gICAqIGluIHRoZSBsb3dlc3QgMTAlIG9mIHRoZSB2YWx1ZXMgYW5kIHRoZSBoaWdoZXN0IDkwJSBvZiB0aGUgdmFsdWVzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0cmltbWVkQ291bnQocDE6IG51bWJlciwgcDI/OiBudW1iZXIpIHtcbiAgICByZXR1cm4gYm91bmRhcnlQZXJjZW50aWxlU3RhdCgndGMnLCAnVEMnLCBwMSwgcDIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0ZXIgYWxpYXMgZm9yIGB0cmltbWVkQ291bnQoKWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRjKHAxOiBudW1iZXIsIHAyPzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIFN0YXRzLnRyaW1tZWRDb3VudChwMSwgcDIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaW1tZWQgc3VtIChUUykgaXMgdGhlIHN1bSBvZiB0aGUgdmFsdWVzIG9mIGRhdGEgcG9pbnRzIGluIGEgY2hvc2VuIHJhbmdlIGZvciBhIHRyaW1tZWQgbWVhbiBzdGF0aXN0aWMuXG4gICAqIEl0IGlzIGVxdWl2YWxlbnQgdG8gYChUcmltbWVkIE1lYW4pICogKFRyaW1tZWQgY291bnQpYC5cbiAgICpcbiAgICogLSBJZiB0d28gbnVtYmVycyBhcmUgZ2l2ZW4sIHRoZXkgZGVmaW5lIHRoZSBsb3dlciBhbmQgdXBwZXIgYm91bmRzIGluIHBlcmNlbnRhZ2VzLFxuICAgKiAgIHJlc3BlY3RpdmVseS5cbiAgICogLSBJZiBvbmUgbnVtYmVyIGlzIGdpdmVuLCBpdCBkZWZpbmVzIHRoZSB1cHBlciBib3VuZCAodGhlIGxvd2VyIGJvdW5kIGlzIGFzc3VtZWQgdG9cbiAgICogICBiZSAwKS5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGB0cyg5MClgIHJldHVybnMgdGhlIHN1bSBvZiB0aGUgZGF0YSBwb2ludHMgbm90IGluY2x1ZGluZyBhbnlcbiAgICogZGF0YSBwb2ludHMgdGhhdCBmYWxsIGluIHRoZSBoaWdoZXN0IDEwJSBvZiB0aGUgdmFsdWVzLiAgYHRzKDEwLCA5MClgXG4gICAqIHJldHVybnMgdGhlIHN1bSBvZiB0aGUgZGF0YSBwb2ludHMgbm90IGluY2x1ZGluZyBhbnkgZGF0YSBwb2ludHMgdGhhdCBmYWxsXG4gICAqIGluIHRoZSBsb3dlc3QgMTAlIG9mIHRoZSB2YWx1ZXMgYW5kIHRoZSBoaWdoZXN0IDkwJSBvZiB0aGUgdmFsdWVzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0cmltbWVkU3VtKHAxOiBudW1iZXIsIHAyPzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGJvdW5kYXJ5UGVyY2VudGlsZVN0YXQoJ3RzJywgJ1RTJywgcDEsIHAyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG9ydGVyIGFsaWFzIGZvciBgdHJpbW1lZFN1bSgpYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdHMocDE6IG51bWJlciwgcDI/OiBudW1iZXIpIHtcbiAgICByZXR1cm4gU3RhdHMudHJpbW1lZFN1bShwMSwgcDIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmNlbnRpbGUgcmFuayAoUFIpIGlzIHRoZSBwZXJjZW50YWdlIG9mIHZhbHVlcyB0aGF0IG1lZXQgYSBmaXhlZCB0aHJlc2hvbGQuXG4gICAqXG4gICAqIC0gSWYgdHdvIG51bWJlcnMgYXJlIGdpdmVuLCB0aGV5IGRlZmluZSB0aGUgbG93ZXIgYW5kIHVwcGVyIGJvdW5kcyBpbiBhYnNvbHV0ZSB2YWx1ZXMsXG4gICAqICAgcmVzcGVjdGl2ZWx5LlxuICAgKiAtIElmIG9uZSBudW1iZXIgaXMgZ2l2ZW4sIGl0IGRlZmluZXMgdGhlIHVwcGVyIGJvdW5kICh0aGUgbG93ZXIgYm91bmQgaXMgYXNzdW1lZCB0b1xuICAgKiAgIGJlIDApLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgYHBlcmNlbnRpbGVSYW5rKDMwMClgIHJldHVybnMgdGhlIHBlcmNlbnRhZ2Ugb2YgZGF0YSBwb2ludHMgdGhhdCBoYXZlIGEgdmFsdWUgb2YgMzAwIG9yIGxlc3MuXG4gICAqIGBwZXJjZW50aWxlUmFuaygxMDAsIDIwMDApYCByZXR1cm5zIHRoZSBwZXJjZW50YWdlIG9mIGRhdGEgcG9pbnRzIHRoYXQgaGF2ZSBhIHZhbHVlIGJldHdlZW4gMTAwIGFuZCAyMDAwLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwZXJjZW50aWxlUmFuayh2MTogbnVtYmVyLCB2Mj86IG51bWJlcikge1xuICAgIGlmICh2MiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gYFBSKCR7djF9OiR7djJ9KWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgUFIoOiR7djF9KWA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0ZXIgYWxpYXMgZm9yIGBwZXJjZW50aWxlUmFuaygpYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcHIodjE6IG51bWJlciwgdjI/OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5wZXJjZW50aWxlUmFuayh2MSwgdjIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFBlcmNlbnRhZ2UoeD86IG51bWJlcikge1xuICBpZiAoeCAhPT0gdW5kZWZpbmVkICYmICh4IDwgMCB8fCB4ID4gMTAwKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0aW5nIGEgcGVyY2VudGFnZSwgZ290OiAke3h9YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBGb3JtYXR0aW5nIGhlbHBlciBiZWNhdXNlIGFsbCB0aGVzZSBzdGF0cyBsb29rIHRoZSBzYW1lXG4gKi9cbmZ1bmN0aW9uIGJvdW5kYXJ5UGVyY2VudGlsZVN0YXQob25lQm91bmRhcnlTdGF0OiBzdHJpbmcsIHR3b0JvdW5kYXJ5U3RhdDogc3RyaW5nLCBwMTogbnVtYmVyLCBwMjogbnVtYmVyIHwgdW5kZWZpbmVkKSB7XG4gIGFzc2VydFBlcmNlbnRhZ2UocDEpO1xuICBhc3NlcnRQZXJjZW50YWdlKHAyKTtcbiAgaWYgKHAyICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gYCR7dHdvQm91bmRhcnlTdGF0fSgke3AxfSU6JHtwMn0lKWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGAke29uZUJvdW5kYXJ5U3RhdH0ke3AxfWA7XG4gIH1cbn0iXX0=