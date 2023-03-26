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
exports.Stats = Stats;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBOztHQUVHO0FBQ0gsTUFBc0IsS0FBSztJQW1DekI7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQWtCO1FBQ3pDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQztLQUN6QjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFrQjtRQUNoQyxPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDckM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQVUsRUFBRSxFQUFXO1FBQy9DLE9BQU8sc0JBQXNCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDbkQ7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBVSxFQUFFLEVBQVc7UUFDdEMsT0FBTyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNsQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bc0JHO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFVLEVBQUUsRUFBVztRQUNsRCxPQUFPLHNCQUFzQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ25EO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQVUsRUFBRSxFQUFXO1FBQ3RDLE9BQU8sS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDckM7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQVUsRUFBRSxFQUFXO1FBQ2hELE9BQU8sc0JBQXNCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDbkQ7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBVSxFQUFFLEVBQVc7UUFDdEMsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNuQztJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQVUsRUFBRSxFQUFXO1FBQzlDLE9BQU8sc0JBQXNCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDbkQ7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBVSxFQUFFLEVBQVc7UUFDdEMsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNqQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSSxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQVUsRUFBRSxFQUFXO1FBQ2xELElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtZQUNwQixPQUFPLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDO1NBQzFCO2FBQU07WUFDTCxPQUFPLE9BQU8sRUFBRSxHQUFHLENBQUM7U0FDckI7S0FDRjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFVLEVBQUUsRUFBVztRQUN0QyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3BDOztBQTlMSCxzQkErTEM7OztBQTlMQzs7R0FFRztBQUNvQixrQkFBWSxHQUFHLGFBQWEsQ0FBQztBQUVwRDs7R0FFRztBQUNvQixhQUFPLEdBQUcsU0FBUyxDQUFDO0FBQzNDOzs7R0FHRztBQUNvQixTQUFHLEdBQUcsS0FBSyxDQUFDO0FBRW5DOzs7R0FHRztBQUNvQixhQUFPLEdBQUcsU0FBUyxDQUFDO0FBRTNDOzs7R0FHRztBQUNvQixhQUFPLEdBQUcsU0FBUyxDQUFDO0FBRTNDOzs7O0dBSUc7QUFDb0IsU0FBRyxHQUFHLEtBQUssQ0FBQztBQWdLckMsU0FBUyxnQkFBZ0IsQ0FBQyxDQUFVO0lBQ2xDLElBQUksQ0FBQyxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFO1FBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDdEQ7QUFDSCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLHNCQUFzQixDQUFDLGVBQXVCLEVBQUUsZUFBdUIsRUFBRSxFQUFVLEVBQUUsRUFBc0I7SUFDbEgsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckIsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckIsSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFO1FBQ3BCLE9BQU8sR0FBRyxlQUFlLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDO0tBQzVDO1NBQU07UUFDTCxPQUFPLEdBQUcsZUFBZSxHQUFHLEVBQUUsRUFBRSxDQUFDO0tBQ2xDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9ucyBmb3Igc3RhbmRhcmQgc3RhdGlzdGljcyBzdHJpbmdzXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTdGF0cyB7XG4gIC8qKlxuICAgKiBUaGUgY291bnQgKG51bWJlcikgb2YgZGF0YSBwb2ludHMgdXNlZCBmb3IgdGhlIHN0YXRpc3RpY2FsIGNhbGN1bGF0aW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTQU1QTEVfQ09VTlQgPSAnU2FtcGxlQ291bnQnO1xuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgb2YgU3VtIC8gU2FtcGxlQ291bnQgZHVyaW5nIHRoZSBzcGVjaWZpZWQgcGVyaW9kLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBVkVSQUdFID0gJ0F2ZXJhZ2UnO1xuICAvKipcbiAgICogQWxsIHZhbHVlcyBzdWJtaXR0ZWQgZm9yIHRoZSBtYXRjaGluZyBtZXRyaWMgYWRkZWQgdG9nZXRoZXIuXG4gICAqIFRoaXMgc3RhdGlzdGljIGNhbiBiZSB1c2VmdWwgZm9yIGRldGVybWluaW5nIHRoZSB0b3RhbCB2b2x1bWUgb2YgYSBtZXRyaWMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFNVTSA9ICdTdW0nO1xuXG4gIC8qKlxuICAgKiBUaGUgbG93ZXN0IHZhbHVlIG9ic2VydmVkIGR1cmluZyB0aGUgc3BlY2lmaWVkIHBlcmlvZC5cbiAgICogWW91IGNhbiB1c2UgdGhpcyB2YWx1ZSB0byBkZXRlcm1pbmUgbG93IHZvbHVtZXMgb2YgYWN0aXZpdHkgZm9yIHlvdXIgYXBwbGljYXRpb24uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1JTklNVU0gPSAnTWluaW11bSc7XG5cbiAgLyoqXG4gICAqIFRoZSBoaWdoZXN0IHZhbHVlIG9ic2VydmVkIGR1cmluZyB0aGUgc3BlY2lmaWVkIHBlcmlvZC5cbiAgICogWW91IGNhbiB1c2UgdGhpcyB2YWx1ZSB0byBkZXRlcm1pbmUgaGlnaCB2b2x1bWVzIG9mIGFjdGl2aXR5IGZvciB5b3VyIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBNQVhJTVVNID0gJ01heGltdW0nO1xuXG4gIC8qKlxuICAgKiBJbnRlcnF1YXJ0aWxlIG1lYW4gKElRTSkgaXMgdGhlIHRyaW1tZWQgbWVhbiBvZiB0aGUgaW50ZXJxdWFydGlsZSByYW5nZSwgb3IgdGhlIG1pZGRsZSA1MCUgb2YgdmFsdWVzLlxuICAgKlxuICAgKiBJdCBpcyBlcXVpdmFsZW50IHRvIGB0cmltbWVkTWVhbigyNSwgNzUpYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgSVFNID0gJ0lRTSc7XG5cbiAgLyoqXG4gICAqIFBlcmNlbnRpbGUgaW5kaWNhdGVzIHRoZSByZWxhdGl2ZSBzdGFuZGluZyBvZiBhIHZhbHVlIGluIGEgZGF0YXNldC5cbiAgICpcbiAgICogUGVyY2VudGlsZXMgaGVscCB5b3UgZ2V0IGEgYmV0dGVyIHVuZGVyc3RhbmRpbmcgb2YgdGhlIGRpc3RyaWJ1dGlvbiBvZiB5b3VyIG1ldHJpYyBkYXRhLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgYHAoOTApYCBpcyB0aGUgOTB0aCBwZXJjZW50aWxlIGFuZCBtZWFucyB0aGF0IDkwJSBvZiB0aGUgZGF0YVxuICAgKiB3aXRoaW4gdGhlIHBlcmlvZCBpcyBsb3dlciB0aGFuIHRoaXMgdmFsdWUgYW5kIDEwJSBvZiB0aGUgZGF0YSBpcyBoaWdoZXJcbiAgICogdGhhbiB0aGlzIHZhbHVlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwZXJjZW50aWxlKHBlcmNlbnRpbGU6IG51bWJlcikge1xuICAgIGFzc2VydFBlcmNlbnRhZ2UocGVyY2VudGlsZSk7XG4gICAgcmV0dXJuIGBwJHtwZXJjZW50aWxlfWA7XG4gIH1cblxuICAvKipcbiAgICogQSBzaG9ydGVyIGFsaWFzIGZvciBgcGVyY2VudGlsZSgpYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcChwZXJjZW50aWxlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gU3RhdHMucGVyY2VudGlsZShwZXJjZW50aWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmltbWVkIG1lYW4gKFRNKSBpcyB0aGUgbWVhbiBvZiBhbGwgdmFsdWVzIHRoYXQgYXJlIGJldHdlZW4gdHdvIHNwZWNpZmllZCBib3VuZGFyaWVzLlxuICAgKlxuICAgKiBWYWx1ZXMgb3V0c2lkZSBvZiB0aGUgYm91bmRhcmllcyBhcmUgaWdub3JlZCB3aGVuIHRoZSBtZWFuIGlzIGNhbGN1bGF0ZWQuXG4gICAqIFlvdSBkZWZpbmUgdGhlIGJvdW5kYXJpZXMgYXMgb25lIG9yIHR3byBudW1iZXJzIGJldHdlZW4gMCBhbmQgMTAwLCB1cCB0byAxMFxuICAgKiBkZWNpbWFsIHBsYWNlcy4gVGhlIG51bWJlcnMgYXJlIHBlcmNlbnRhZ2VzLlxuICAgKlxuICAgKiAtIElmIHR3byBudW1iZXJzIGFyZSBnaXZlbiwgdGhleSBkZWZpbmUgdGhlIGxvd2VyIGFuZCB1cHBlciBib3VuZHMgaW4gcGVyY2VudGFnZXMsXG4gICAqICAgcmVzcGVjdGl2ZWx5LlxuICAgKiAtIElmIG9uZSBudW1iZXIgaXMgZ2l2ZW4sIGl0IGRlZmluZXMgdGhlIHVwcGVyIGJvdW5kICh0aGUgbG93ZXIgYm91bmQgaXMgYXNzdW1lZCB0b1xuICAgKiAgIGJlIDApLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgYHRtKDkwKWAgY2FsY3VsYXRlcyB0aGUgYXZlcmFnZSBhZnRlciByZW1vdmluZyB0aGUgMTAlIG9mIGRhdGFcbiAgICogcG9pbnRzIHdpdGggdGhlIGhpZ2hlc3QgdmFsdWVzOyBgdG0oMTAsIDkwKWAgY2FsY3VsYXRlcyB0aGUgYXZlcmFnZSBhZnRlciByZW1vdmluZyB0aGVcbiAgICogMTAlIHdpdGggdGhlIGxvd2VzdCBhbmQgMTAlIHdpdGggdGhlIGhpZ2hlc3QgdmFsdWVzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0cmltbWVkTWVhbihwMTogbnVtYmVyLCBwMj86IG51bWJlcikge1xuICAgIHJldHVybiBib3VuZGFyeVBlcmNlbnRpbGVTdGF0KCd0bScsICdUTScsIHAxLCBwMik7XG4gIH1cblxuICAvKipcbiAgICogQSBzaG9ydGVyIGFsaWFzIGZvciBgdHJpbW1lZE1lYW4oKWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRtKHAxOiBudW1iZXIsIHAyPzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIFN0YXRzLnRyaW1tZWRNZWFuKHAxLCBwMik7XG4gIH1cblxuICAvKipcbiAgICogV2luc29yaXplZCBtZWFuIChXTSkgaXMgc2ltaWxhciB0byB0cmltbWVkIG1lYW4uXG4gICAqXG4gICAqIEhvd2V2ZXIsIHdpdGggd2luc29yaXplZCBtZWFuLCB0aGUgdmFsdWVzIHRoYXQgYXJlIG91dHNpZGUgdGhlIGJvdW5kYXJ5IGFyZVxuICAgKiBub3QgaWdub3JlZCwgYnV0IGluc3RlYWQgYXJlIGNvbnNpZGVyZWQgdG8gYmUgZXF1YWwgdG8gdGhlIHZhbHVlIGF0IHRoZVxuICAgKiBlZGdlIG9mIHRoZSBhcHByb3ByaWF0ZSBib3VuZGFyeS4gIEFmdGVyIHRoaXMgbm9ybWFsaXphdGlvbiwgdGhlIGF2ZXJhZ2UgaXNcbiAgICogY2FsY3VsYXRlZC4gWW91IGRlZmluZSB0aGUgYm91bmRhcmllcyBhcyBvbmUgb3IgdHdvIG51bWJlcnMgYmV0d2VlbiAwIGFuZFxuICAgKiAxMDAsIHVwIHRvIDEwIGRlY2ltYWwgcGxhY2VzLlxuICAgKlxuICAgKiAtIElmIHR3byBudW1iZXJzIGFyZSBnaXZlbiwgdGhleSBkZWZpbmUgdGhlIGxvd2VyIGFuZCB1cHBlciBib3VuZHMgaW4gcGVyY2VudGFnZXMsXG4gICAqICAgcmVzcGVjdGl2ZWx5LlxuICAgKiAtIElmIG9uZSBudW1iZXIgaXMgZ2l2ZW4sIGl0IGRlZmluZXMgdGhlIHVwcGVyIGJvdW5kICh0aGUgbG93ZXIgYm91bmQgaXMgYXNzdW1lZCB0b1xuICAgKiAgIGJlIDApLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgYHRtKDkwKWAgY2FsY3VsYXRlcyB0aGUgYXZlcmFnZSBhZnRlciByZW1vdmluZyB0aGUgMTAlIG9mIGRhdGFcbiAgICogcG9pbnRzIHdpdGggdGhlIGhpZ2hlc3QgdmFsdWVzOyBgdG0oMTAsIDkwKWAgY2FsY3VsYXRlcyB0aGUgYXZlcmFnZSBhZnRlciByZW1vdmluZyB0aGVcbiAgICogMTAlIHdpdGggdGhlIGxvd2VzdCBhbmQgMTAlIHdpdGggdGhlIGhpZ2hlc3QgdmFsdWVzLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgYHdtKDkwKWAgY2FsY3VsYXRlcyB0aGUgYXZlcmFnZSB3aGlsZSB0cmVhdGluZyB0aGUgMTAlIG9mIHRoZVxuICAgKiBoaWdoZXN0IHZhbHVlcyB0byBiZSBlcXVhbCB0byB0aGUgdmFsdWUgYXQgdGhlIDkwdGggcGVyY2VudGlsZS5cbiAgICogYHdtKDEwLCA5MClgIGNhbGN1bGF0ZXMgdGhlIGF2ZXJhZ2Ugd2hpbGUgdHJlYWluZyB0aGUgYm90dG9tIDEwJSBhbmQgdGhlXG4gICAqIHRvcCAxMCUgb2YgdmFsdWVzIHRvIGJlIGVxdWFsIHRvIHRoZSBib3VuZGFyeSB2YWx1ZXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHdpbnNvcml6ZWRNZWFuKHAxOiBudW1iZXIsIHAyPzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGJvdW5kYXJ5UGVyY2VudGlsZVN0YXQoJ3dtJywgJ1dNJywgcDEsIHAyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNob3J0ZXIgYWxpYXMgZm9yIGB3aW5zb3JpemVkTWVhbigpYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgd20ocDE6IG51bWJlciwgcDI/OiBudW1iZXIpIHtcbiAgICByZXR1cm4gU3RhdHMud2luc29yaXplZE1lYW4ocDEsIHAyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmltbWVkIGNvdW50IChUQykgaXMgdGhlIG51bWJlciBvZiBkYXRhIHBvaW50cyBpbiB0aGUgY2hvc2VuIHJhbmdlIGZvciBhIHRyaW1tZWQgbWVhbiBzdGF0aXN0aWMuXG4gICAqXG4gICAqIC0gSWYgdHdvIG51bWJlcnMgYXJlIGdpdmVuLCB0aGV5IGRlZmluZSB0aGUgbG93ZXIgYW5kIHVwcGVyIGJvdW5kcyBpbiBwZXJjZW50YWdlcyxcbiAgICogICByZXNwZWN0aXZlbHkuXG4gICAqIC0gSWYgb25lIG51bWJlciBpcyBnaXZlbiwgaXQgZGVmaW5lcyB0aGUgdXBwZXIgYm91bmQgKHRoZSBsb3dlciBib3VuZCBpcyBhc3N1bWVkIHRvXG4gICAqICAgYmUgMCkuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBgdGMoOTApYCByZXR1cm5zIHRoZSBudW1iZXIgb2YgZGF0YSBwb2ludHMgbm90IGluY2x1ZGluZyBhbnlcbiAgICogZGF0YSBwb2ludHMgdGhhdCBmYWxsIGluIHRoZSBoaWdoZXN0IDEwJSBvZiB0aGUgdmFsdWVzLiBgdGMoMTAsIDkwKWBcbiAgICogcmV0dXJucyB0aGUgbnVtYmVyIG9mIGRhdGEgcG9pbnRzIG5vdCBpbmNsdWRpbmcgYW55IGRhdGEgcG9pbnRzIHRoYXQgZmFsbFxuICAgKiBpbiB0aGUgbG93ZXN0IDEwJSBvZiB0aGUgdmFsdWVzIGFuZCB0aGUgaGlnaGVzdCA5MCUgb2YgdGhlIHZhbHVlcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdHJpbW1lZENvdW50KHAxOiBudW1iZXIsIHAyPzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGJvdW5kYXJ5UGVyY2VudGlsZVN0YXQoJ3RjJywgJ1RDJywgcDEsIHAyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG9ydGVyIGFsaWFzIGZvciBgdHJpbW1lZENvdW50KClgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0YyhwMTogbnVtYmVyLCBwMj86IG51bWJlcikge1xuICAgIHJldHVybiBTdGF0cy50cmltbWVkQ291bnQocDEsIHAyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmltbWVkIHN1bSAoVFMpIGlzIHRoZSBzdW0gb2YgdGhlIHZhbHVlcyBvZiBkYXRhIHBvaW50cyBpbiBhIGNob3NlbiByYW5nZSBmb3IgYSB0cmltbWVkIG1lYW4gc3RhdGlzdGljLlxuICAgKiBJdCBpcyBlcXVpdmFsZW50IHRvIGAoVHJpbW1lZCBNZWFuKSAqIChUcmltbWVkIGNvdW50KWAuXG4gICAqXG4gICAqIC0gSWYgdHdvIG51bWJlcnMgYXJlIGdpdmVuLCB0aGV5IGRlZmluZSB0aGUgbG93ZXIgYW5kIHVwcGVyIGJvdW5kcyBpbiBwZXJjZW50YWdlcyxcbiAgICogICByZXNwZWN0aXZlbHkuXG4gICAqIC0gSWYgb25lIG51bWJlciBpcyBnaXZlbiwgaXQgZGVmaW5lcyB0aGUgdXBwZXIgYm91bmQgKHRoZSBsb3dlciBib3VuZCBpcyBhc3N1bWVkIHRvXG4gICAqICAgYmUgMCkuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBgdHMoOTApYCByZXR1cm5zIHRoZSBzdW0gb2YgdGhlIGRhdGEgcG9pbnRzIG5vdCBpbmNsdWRpbmcgYW55XG4gICAqIGRhdGEgcG9pbnRzIHRoYXQgZmFsbCBpbiB0aGUgaGlnaGVzdCAxMCUgb2YgdGhlIHZhbHVlcy4gIGB0cygxMCwgOTApYFxuICAgKiByZXR1cm5zIHRoZSBzdW0gb2YgdGhlIGRhdGEgcG9pbnRzIG5vdCBpbmNsdWRpbmcgYW55IGRhdGEgcG9pbnRzIHRoYXQgZmFsbFxuICAgKiBpbiB0aGUgbG93ZXN0IDEwJSBvZiB0aGUgdmFsdWVzIGFuZCB0aGUgaGlnaGVzdCA5MCUgb2YgdGhlIHZhbHVlcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdHJpbW1lZFN1bShwMTogbnVtYmVyLCBwMj86IG51bWJlcikge1xuICAgIHJldHVybiBib3VuZGFyeVBlcmNlbnRpbGVTdGF0KCd0cycsICdUUycsIHAxLCBwMik7XG4gIH1cblxuICAvKipcbiAgICogU2hvcnRlciBhbGlhcyBmb3IgYHRyaW1tZWRTdW0oKWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRzKHAxOiBudW1iZXIsIHAyPzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIFN0YXRzLnRyaW1tZWRTdW0ocDEsIHAyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJjZW50aWxlIHJhbmsgKFBSKSBpcyB0aGUgcGVyY2VudGFnZSBvZiB2YWx1ZXMgdGhhdCBtZWV0IGEgZml4ZWQgdGhyZXNob2xkLlxuICAgKlxuICAgKiAtIElmIHR3byBudW1iZXJzIGFyZSBnaXZlbiwgdGhleSBkZWZpbmUgdGhlIGxvd2VyIGFuZCB1cHBlciBib3VuZHMgaW4gYWJzb2x1dGUgdmFsdWVzLFxuICAgKiAgIHJlc3BlY3RpdmVseS5cbiAgICogLSBJZiBvbmUgbnVtYmVyIGlzIGdpdmVuLCBpdCBkZWZpbmVzIHRoZSB1cHBlciBib3VuZCAodGhlIGxvd2VyIGJvdW5kIGlzIGFzc3VtZWQgdG9cbiAgICogICBiZSAwKS5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGBwZXJjZW50aWxlUmFuaygzMDApYCByZXR1cm5zIHRoZSBwZXJjZW50YWdlIG9mIGRhdGEgcG9pbnRzIHRoYXQgaGF2ZSBhIHZhbHVlIG9mIDMwMCBvciBsZXNzLlxuICAgKiBgcGVyY2VudGlsZVJhbmsoMTAwLCAyMDAwKWAgcmV0dXJucyB0aGUgcGVyY2VudGFnZSBvZiBkYXRhIHBvaW50cyB0aGF0IGhhdmUgYSB2YWx1ZSBiZXR3ZWVuIDEwMCBhbmQgMjAwMC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGVyY2VudGlsZVJhbmsodjE6IG51bWJlciwgdjI/OiBudW1iZXIpIHtcbiAgICBpZiAodjIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGBQUigke3YxfToke3YyfSlgO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYFBSKDoke3YxfSlgO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG9ydGVyIGFsaWFzIGZvciBgcGVyY2VudGlsZVJhbmsoKWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHByKHYxOiBudW1iZXIsIHYyPzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMucGVyY2VudGlsZVJhbmsodjEsIHYyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRQZXJjZW50YWdlKHg/OiBudW1iZXIpIHtcbiAgaWYgKHggIT09IHVuZGVmaW5lZCAmJiAoeCA8IDAgfHwgeCA+IDEwMCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGluZyBhIHBlcmNlbnRhZ2UsIGdvdDogJHt4fWApO1xuICB9XG59XG5cbi8qKlxuICogRm9ybWF0dGluZyBoZWxwZXIgYmVjYXVzZSBhbGwgdGhlc2Ugc3RhdHMgbG9vayB0aGUgc2FtZVxuICovXG5mdW5jdGlvbiBib3VuZGFyeVBlcmNlbnRpbGVTdGF0KG9uZUJvdW5kYXJ5U3RhdDogc3RyaW5nLCB0d29Cb3VuZGFyeVN0YXQ6IHN0cmluZywgcDE6IG51bWJlciwgcDI6IG51bWJlciB8IHVuZGVmaW5lZCkge1xuICBhc3NlcnRQZXJjZW50YWdlKHAxKTtcbiAgYXNzZXJ0UGVyY2VudGFnZShwMik7XG4gIGlmIChwMiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGAke3R3b0JvdW5kYXJ5U3RhdH0oJHtwMX0lOiR7cDJ9JSlgO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBgJHtvbmVCb3VuZGFyeVN0YXR9JHtwMX1gO1xuICB9XG59Il19