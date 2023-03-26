"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAlarmThresholds = exports.normalizeIntervals = void 0;
/**
 * Normalize the given interval set to cover the complete number line and make sure it has at most one gap
 */
function normalizeIntervals(intervals, changesAreAbsolute) {
    // Make intervals a complete numberline
    const full = orderAndCompleteIntervals(intervals);
    // Add 'undefined's in uncovered areas of the number line
    makeGapsUndefined(full);
    // In case of relative changes, treat 0-change also as 'undefined' (= no change action)
    if (!changesAreAbsolute) {
        makeZerosUndefined(full);
    }
    // Combine adjacent undefines and make sure there's at most one of them
    combineUndefineds(full);
    validateAtMostOneUndefined(full);
    return full;
}
exports.normalizeIntervals = normalizeIntervals;
/**
 * Completely order scaling intervals, making their lower and upper bounds concrete.
 */
function orderAndCompleteIntervals(intervals) {
    if (intervals.length < 2) {
        throw new Error('Require at least 2 intervals');
    }
    for (const interval of intervals) {
        if (interval.lower === undefined && interval.upper === undefined) {
            throw new Error(`Must supply at least one of 'upper' or 'lower', got: ${JSON.stringify(interval)}`);
        }
    }
    // Make a copy
    intervals = intervals.map(x => ({ ...x }));
    // Sort by whatever number we have for each interval
    intervals.sort(comparatorFromKey((x) => x.lower ?? x.upper));
    // Propagate boundaries until no more change
    while (propagateBounds(intervals)) { /* Repeat */ }
    const lastIndex = intervals.length - 1;
    // Validate that no intervals have undefined bounds now, which must mean they're complete.
    if (intervals[0].lower === undefined) {
        intervals[0] = { ...intervals[0], lower: 0 };
    }
    if (intervals[lastIndex].upper === undefined) {
        intervals[lastIndex] = { ...intervals[lastIndex], upper: Infinity };
    }
    for (const interval of intervals) {
        if (interval.lower === undefined || interval.upper === undefined) {
            throw new Error(`Could not determine the lower and upper bounds for ${JSON.stringify(interval)}`);
        }
    }
    const completeIntervals = intervals;
    // Validate that we have nonoverlapping intervals now.
    for (let i = 0; i < completeIntervals.length - 1; i++) {
        if (overlap(completeIntervals[i], completeIntervals[i + 1])) {
            throw new Error(`Two intervals overlap: ${JSON.stringify(completeIntervals[i])} and ${JSON.stringify(completeIntervals[i + 1])}`);
        }
    }
    // Fill up the gaps
    return completeIntervals;
}
/**
 * Make the intervals cover the complete number line
 *
 * This entails adding intervals with an 'undefined' change to fill up the gaps.
 *
 * Since metrics have a halfopen interval, the first one will get a lower bound
 * of 0, the last one will get an upper bound of +Infinity.
 *
 * In case of absolute adjustments, the lower number of the adjacent bound will
 * be used, which means conservative change. In case of relative adjustments,
 * we'll use relative adjusment 0 (which means no change).
 */
function makeGapsUndefined(intervals) {
    // Add edge intervals if necessary, but only for relative adjustments. Since we're
    // going to make scaling intervals extend all the way out to infinity on either side,
    // the result is the same for absolute adjustments anyway.
    if (intervals[0].lower !== 0) {
        intervals.splice(0, 0, {
            lower: 0,
            upper: intervals[0].lower,
            change: undefined,
        });
    }
    if (last(intervals).upper !== Infinity) {
        intervals.push({
            lower: last(intervals).upper,
            upper: Infinity,
            change: undefined,
        });
    }
    let i = 1;
    while (i < intervals.length) {
        if (intervals[i - 1].upper < intervals[i].lower) {
            intervals.splice(i, 0, {
                lower: intervals[i - 1].upper,
                upper: intervals[i].lower,
                change: undefined,
            });
        }
        else {
            i++;
        }
    }
}
/**
 * Turn zero changes into undefined, in-place
 */
function makeZerosUndefined(intervals) {
    for (let i = 0; i < intervals.length; ++i) {
        const interval = intervals[i];
        if (interval.change === 0) {
            intervals[i] = { ...interval, change: undefined };
        }
    }
}
/**
 * If there are adjacent "undefined" intervals, combine them
 */
function combineUndefineds(intervals) {
    let i = 0;
    while (i < intervals.length - 1) {
        if (intervals[i].change === undefined && intervals[i + 1].change === undefined) {
            intervals[i] = { ...intervals[i], upper: intervals[i + 1].upper };
            intervals.splice(i + 1, 1);
        }
        else {
            i++;
        }
    }
}
function validateAtMostOneUndefined(intervals) {
    const undef = intervals.filter(x => x.change === undefined);
    if (undef.length > 1) {
        throw new Error(`Can have at most one no-change interval, got ${JSON.stringify(undef)}`);
    }
}
function comparatorFromKey(keyFn) {
    return (a, b) => {
        const keyA = keyFn(a);
        const keyB = keyFn(b);
        if (keyA < keyB) {
            return -1;
        }
        if (keyA === keyB) {
            return 0;
        }
        return 1;
    };
}
function propagateBounds(intervals) {
    let ret = false;
    // Propagate upper bounds upwards
    for (let i = 0; i < intervals.length - 1; i++) {
        if (intervals[i].upper !== undefined && intervals[i + 1].lower === undefined) {
            intervals[i + 1] = { ...intervals[i + 1], lower: intervals[i].upper };
            ret = true;
        }
    }
    // Propagate lower bounds downwards
    for (let i = intervals.length - 1; i >= 1; i--) {
        if (intervals[i].lower !== undefined && intervals[i - 1].upper === undefined) {
            intervals[i - 1] = { ...intervals[i - 1], upper: intervals[i].lower };
            ret = true;
        }
    }
    return ret;
}
/**
 * Whether two intervals overlap
 */
function overlap(a, b) {
    return a.lower < b.upper && a.upper > b.lower;
}
function last(xs) {
    return xs[xs.length - 1];
}
/**
 * Locate the intervals that should have the alarm thresholds, by index.
 *
 * Pick the intervals on either side of the singleton "undefined" interval, or
 * pick the middle interval if there's no such interval.
 */
function findAlarmThresholds(intervals) {
    const gapIndex = intervals.findIndex(x => x.change === undefined);
    if (gapIndex !== -1) {
        return {
            lowerAlarmIntervalIndex: gapIndex > 0 ? gapIndex - 1 : undefined,
            upperAlarmIntervalIndex: gapIndex < intervals.length - 1 ? gapIndex + 1 : undefined,
        };
    }
    if (intervals.length === 1) {
        return { upperAlarmIntervalIndex: 0 };
    }
    const middleIndex = Math.floor(intervals.length / 2);
    return {
        lowerAlarmIntervalIndex: middleIndex - 1,
        upperAlarmIntervalIndex: middleIndex,
    };
}
exports.findAlarmThresholds = findAlarmThresholds;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlcnZhbC11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQTs7R0FFRztBQUNILFNBQWdCLGtCQUFrQixDQUFDLFNBQTRCLEVBQUUsa0JBQTJCO0lBQzFGLHVDQUF1QztJQUN2QyxNQUFNLElBQUksR0FBRyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsRCx5REFBeUQ7SUFDekQsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFeEIsdUZBQXVGO0lBQ3ZGLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtRQUFFLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0tBQUU7SUFFdEQsdUVBQXVFO0lBQ3ZFLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWpDLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQWRELGdEQWNDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLHlCQUF5QixDQUFDLFNBQTRCO0lBQzdELElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0tBQ2pEO0lBRUQsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7UUFDaEMsSUFBSSxRQUFRLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxRQUFRLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUNoRSxNQUFNLElBQUksS0FBSyxDQUFDLHdEQUF3RCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNyRztLQUNGO0lBRUQsY0FBYztJQUNkLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFD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QUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFPRDs7Ozs7R0FLRztBQUNILFNBQWdCLG1CQUFtQixDQUFDLFNBQW9DO0lBQ3RFLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDO0lBRWxFLElBQUksUUFBUSxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ25CLE9BQU87WUFDTCx1QkFBdUIsRUFBRSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ2hFLHVCQUF1QixFQUFFLFFBQVEsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztTQUNwRixDQUFDO0tBQ0g7SUFFRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzFCLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxDQUFDLEVBQUUsQ0FBQztLQUN2QztJQUVELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUVyRCxPQUFPO1FBQ0wsdUJBQXVCLEVBQUUsV0FBVyxHQUFHLENBQUM7UUFDeEMsdUJBQXVCLEVBQUUsV0FBVztLQUNyQyxDQUFDO0FBQ0osQ0FBQztBQXBCRCxrREFvQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTY2FsaW5nSW50ZXJ2YWwgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBDb21wbGV0ZVNjYWxpbmdJbnRlcnZhbCB7XG4gIHJlYWRvbmx5IGxvd2VyOiBudW1iZXI7XG4gIHJlYWRvbmx5IHVwcGVyOiBudW1iZXI7XG4gIHJlYWRvbmx5IGNoYW5nZT86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgdGhlIGdpdmVuIGludGVydmFsIHNldCB0byBjb3ZlciB0aGUgY29tcGxldGUgbnVtYmVyIGxpbmUgYW5kIG1ha2Ugc3VyZSBpdCBoYXMgYXQgbW9zdCBvbmUgZ2FwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVJbnRlcnZhbHMoaW50ZXJ2YWxzOiBTY2FsaW5nSW50ZXJ2YWxbXSwgY2hhbmdlc0FyZUFic29sdXRlOiBib29sZWFuKTogQ29tcGxldGVTY2FsaW5nSW50ZXJ2YWxbXSB7XG4gIC8vIE1ha2UgaW50ZXJ2YWxzIGEgY29tcGxldGUgbnVtYmVybGluZVxuICBjb25zdCBmdWxsID0gb3JkZXJBbmRDb21wbGV0ZUludGVydmFscyhpbnRlcnZhbHMpO1xuICAvLyBBZGQgJ3VuZGVmaW5lZCdzIGluIHVuY292ZXJlZCBhcmVhcyBvZiB0aGUgbnVtYmVyIGxpbmVcbiAgbWFrZUdhcHNVbmRlZmluZWQoZnVsbCk7XG5cbiAgLy8gSW4gY2FzZSBvZiByZWxhdGl2ZSBjaGFuZ2VzLCB0cmVhdCAwLWNoYW5nZSBhbHNvIGFzICd1bmRlZmluZWQnICg9IG5vIGNoYW5nZSBhY3Rpb24pXG4gIGlmICghY2hhbmdlc0FyZUFic29sdXRlKSB7IG1ha2VaZXJvc1VuZGVmaW5lZChmdWxsKTsgfVxuXG4gIC8vIENvbWJpbmUgYWRqYWNlbnQgdW5kZWZpbmVzIGFuZCBtYWtlIHN1cmUgdGhlcmUncyBhdCBtb3N0IG9uZSBvZiB0aGVtXG4gIGNvbWJpbmVVbmRlZmluZWRzKGZ1bGwpO1xuICB2YWxpZGF0ZUF0TW9zdE9uZVVuZGVmaW5lZChmdWxsKTtcblxuICByZXR1cm4gZnVsbDtcbn1cblxuLyoqXG4gKiBDb21wbGV0ZWx5IG9yZGVyIHNjYWxpbmcgaW50ZXJ2YWxzLCBtYWtpbmcgdGhlaXIgbG93ZXIgYW5kIHVwcGVyIGJvdW5kcyBjb25jcmV0ZS5cbiAqL1xuZnVuY3Rpb24gb3JkZXJBbmRDb21wbGV0ZUludGVydmFscyhpbnRlcnZhbHM6IFNjYWxpbmdJbnRlcnZhbFtdKTogQ29tcGxldGVTY2FsaW5nSW50ZXJ2YWxbXSB7XG4gIGlmIChpbnRlcnZhbHMubGVuZ3RoIDwgMikge1xuICAgIHRocm93IG5ldyBFcnJvcignUmVxdWlyZSBhdCBsZWFzdCAyIGludGVydmFscycpO1xuICB9XG5cbiAgZm9yIChjb25zdCBpbnRlcnZhbCBvZiBpbnRlcnZhbHMpIHtcbiAgICBpZiAoaW50ZXJ2YWwubG93ZXIgPT09IHVuZGVmaW5lZCAmJiBpbnRlcnZhbC51cHBlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11c3Qgc3VwcGx5IGF0IGxlYXN0IG9uZSBvZiAndXBwZXInIG9yICdsb3dlcicsIGdvdDogJHtKU09OLnN0cmluZ2lmeShpbnRlcnZhbCl9YCk7XG4gICAgfVxuICB9XG5cbiAgLy8gTWFrZSBhIGNvcHlcbiAgaW50ZXJ2YWxzID0gaW50ZXJ2YWxzLm1hcCh4ID0+ICh7IC4uLnggfSkpO1xuXG4gIC8vIFNvcnQgYnkgd2hhdGV2ZXIgbnVtYmVyIHdlIGhhdmUgZm9yIGVhY2ggaW50ZXJ2YWxcbiAgaW50ZXJ2YWxzLnNvcnQoY29tcGFyYXRvckZyb21LZXkoKHg6IFNjYWxpbmdJbnRlcnZhbCkgPT4geC5sb3dlciA/PyB4LnVwcGVyKSk7XG5cbiAgLy8gUHJvcGFnYXRlIGJvdW5kYXJpZXMgdW50aWwgbm8gbW9yZSBjaGFuZ2VcbiAgd2hpbGUgKHByb3BhZ2F0ZUJvdW5kcyhpbnRlcnZhbHMpKSB7IC8qIFJlcGVhdCAqLyB9XG5cbiAgY29uc3QgbGFzdEluZGV4ID0gaW50ZXJ2YWxzLmxlbmd0aCAtIDE7XG5cbiAgLy8gVmFsaWRhdGUgdGhhdCBubyBpbnRlcnZhbHMgaGF2ZSB1bmRlZmluZWQgYm91bmRzIG5vdywgd2hpY2ggbXVzdCBtZWFuIHRoZXkncmUgY29tcGxldGUuXG4gIGlmIChpbnRlcnZhbHNbMF0ubG93ZXIgPT09IHVuZGVmaW5lZCkgeyBpbnRlcnZhbHNbMF0gPSB7IC4uLmludGVydmFsc1swXSwgbG93ZXI6IDAgfTsgfVxuICBpZiAoaW50ZXJ2YWxzW2xhc3RJbmRleF0udXBwZXIgPT09IHVuZGVmaW5lZCkgeyBpbnRlcnZhbHNbbGFzdEluZGV4XSA9IHsgLi4uaW50ZXJ2YWxzW2xhc3RJbmRleF0sIHVwcGVyOiBJbmZpbml0eSB9OyB9XG4gIGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgaW50ZXJ2YWxzKSB7XG4gICAgaWYgKGludGVydmFsLmxvd2VyID09PSB1bmRlZmluZWQgfHwgaW50ZXJ2YWwudXBwZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZGV0ZXJtaW5lIHRoZSBsb3dlciBhbmQgdXBwZXIgYm91bmRzIGZvciAke0pTT04uc3RyaW5naWZ5KGludGVydmFsKX1gKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBjb21wbGV0ZUludGVydmFscyA9IGludGVydmFscyBhcyBDb21wbGV0ZVNjYWxpbmdJbnRlcnZhbFtdO1xuXG4gIC8vIFZhbGlkYXRlIHRoYXQgd2UgaGF2ZSBub25vdmVybGFwcGluZyBpbnRlcnZhbHMgbm93LlxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXBsZXRlSW50ZXJ2YWxzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIGlmIChvdmVybGFwKGNvbXBsZXRlSW50ZXJ2YWxzW2ldLCBjb21wbGV0ZUludGVydmFsc1tpICsgMV0pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFR3byBpbnRlcnZhbHMgb3ZlcmxhcDogJHtKU09OLnN0cmluZ2lmeShjb21wbGV0ZUludGVydmFsc1tpXSl9IGFuZCAke0pTT04uc3RyaW5naWZ5KGNvbXBsZXRlSW50ZXJ2YWxzW2kgKyAxXSl9YCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRmlsbCB1cCB0aGUgZ2Fwc1xuXG4gIHJldHVybiBjb21wbGV0ZUludGVydmFscztcbn1cblxuLyoqXG4gKiBNYWtlIHRoZSBpbnRlcnZhbHMgY292ZXIgdGhlIGNvbXBsZXRlIG51bWJlciBsaW5lXG4gKlxuICogVGhpcyBlbnRhaWxzIGFkZGluZyBpbnRlcnZhbHMgd2l0aCBhbiAndW5kZWZpbmVkJyBjaGFuZ2UgdG8gZmlsbCB1cCB0aGUgZ2Fwcy5cbiAqXG4gKiBTaW5jZSBtZXRyaWNzIGhhdmUgYSBoYWxmb3BlbiBpbnRlcnZhbCwgdGhlIGZpcnN0IG9uZSB3aWxsIGdldCBhIGxvd2VyIGJvdW5kXG4gKiBvZiAwLCB0aGUgbGFzdCBvbmUgd2lsbCBnZXQgYW4gdXBwZXIgYm91bmQgb2YgK0luZmluaXR5LlxuICpcbiAqIEluIGNhc2Ugb2YgYWJzb2x1dGUgYWRqdXN0bWVudHMsIHRoZSBsb3dlciBudW1iZXIgb2YgdGhlIGFkamFjZW50IGJvdW5kIHdpbGxcbiAqIGJlIHVzZWQsIHdoaWNoIG1lYW5zIGNvbnNlcnZhdGl2ZSBjaGFuZ2UuIEluIGNhc2Ugb2YgcmVsYXRpdmUgYWRqdXN0bWVudHMsXG4gKiB3ZSdsbCB1c2UgcmVsYXRpdmUgYWRqdXNtZW50IDAgKHdoaWNoIG1lYW5zIG5vIGNoYW5nZSkuXG4gKi9cbmZ1bmN0aW9uIG1ha2VHYXBzVW5kZWZpbmVkKGludGVydmFsczogQ29tcGxldGVTY2FsaW5nSW50ZXJ2YWxbXSkge1xuICAvLyBBZGQgZWRnZSBpbnRlcnZhbHMgaWYgbmVjZXNzYXJ5LCBidXQgb25seSBmb3IgcmVsYXRpdmUgYWRqdXN0bWVudHMuIFNpbmNlIHdlJ3JlXG4gIC8vIGdvaW5nIHRvIG1ha2Ugc2NhbGluZyBpbnRlcnZhbHMgZXh0ZW5kIGFsbCB0aGUgd2F5IG91dCB0byBpbmZpbml0eSBvbiBlaXRoZXIgc2lkZSxcbiAgLy8gdGhlIHJlc3VsdCBpcyB0aGUgc2FtZSBmb3IgYWJzb2x1dGUgYWRqdXN0bWVudHMgYW55d2F5LlxuICBpZiAoaW50ZXJ2YWxzWzBdLmxvd2VyICE9PSAwKSB7XG4gICAgaW50ZXJ2YWxzLnNwbGljZSgwLCAwLCB7XG4gICAgICBsb3dlcjogMCxcbiAgICAgIHVwcGVyOiBpbnRlcnZhbHNbMF0ubG93ZXIsXG4gICAgICBjaGFuZ2U6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfVxuICBpZiAobGFzdChpbnRlcnZhbHMpLnVwcGVyICE9PSBJbmZpbml0eSkge1xuICAgIGludGVydmFscy5wdXNoKHtcbiAgICAgIGxvd2VyOiBsYXN0KGludGVydmFscykudXBwZXIsXG4gICAgICB1cHBlcjogSW5maW5pdHksXG4gICAgICBjaGFuZ2U6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfVxuXG4gIGxldCBpID0gMTtcbiAgd2hpbGUgKGkgPCBpbnRlcnZhbHMubGVuZ3RoKSB7XG4gICAgaWYgKGludGVydmFsc1tpIC0gMV0udXBwZXIgPCBpbnRlcnZhbHNbaV0ubG93ZXIpIHtcbiAgICAgIGludGVydmFscy5zcGxpY2UoaSwgMCwge1xuICAgICAgICBsb3dlcjogaW50ZXJ2YWxzW2kgLSAxXS51cHBlcixcbiAgICAgICAgdXBwZXI6IGludGVydmFsc1tpXS5sb3dlcixcbiAgICAgICAgY2hhbmdlOiB1bmRlZmluZWQsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaSsrO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFR1cm4gemVybyBjaGFuZ2VzIGludG8gdW5kZWZpbmVkLCBpbi1wbGFjZVxuICovXG5mdW5jdGlvbiBtYWtlWmVyb3NVbmRlZmluZWQoaW50ZXJ2YWxzOiBDb21wbGV0ZVNjYWxpbmdJbnRlcnZhbFtdKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW50ZXJ2YWxzLmxlbmd0aDsgKytpKSB7XG4gICAgY29uc3QgaW50ZXJ2YWwgPSBpbnRlcnZhbHNbaV07XG4gICAgaWYgKGludGVydmFsLmNoYW5nZSA9PT0gMCkge1xuICAgICAgaW50ZXJ2YWxzW2ldID0geyAuLi5pbnRlcnZhbCwgY2hhbmdlOiB1bmRlZmluZWQgfTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBJZiB0aGVyZSBhcmUgYWRqYWNlbnQgXCJ1bmRlZmluZWRcIiBpbnRlcnZhbHMsIGNvbWJpbmUgdGhlbVxuICovXG5mdW5jdGlvbiBjb21iaW5lVW5kZWZpbmVkcyhpbnRlcnZhbHM6IENvbXBsZXRlU2NhbGluZ0ludGVydmFsW10pIHtcbiAgbGV0IGkgPSAwO1xuICB3aGlsZSAoaSA8IGludGVydmFscy5sZW5ndGggLSAxKSB7XG4gICAgaWYgKGludGVydmFsc1tpXS5jaGFuZ2UgPT09IHVuZGVmaW5lZCAmJiBpbnRlcnZhbHNbaSArIDFdLmNoYW5nZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpbnRlcnZhbHNbaV0gPSB7IC4uLmludGVydmFsc1tpXSwgdXBwZXI6IGludGVydmFsc1tpICsgMV0udXBwZXIgfTtcbiAgICAgIGludGVydmFscy5zcGxpY2UoaSArIDEsIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpKys7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQXRNb3N0T25lVW5kZWZpbmVkKGludGVydmFsczogQ29tcGxldGVTY2FsaW5nSW50ZXJ2YWxbXSkge1xuICBjb25zdCB1bmRlZiA9IGludGVydmFscy5maWx0ZXIoeCA9PiB4LmNoYW5nZSA9PT0gdW5kZWZpbmVkKTtcbiAgaWYgKHVuZGVmLmxlbmd0aCA+IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbiBoYXZlIGF0IG1vc3Qgb25lIG5vLWNoYW5nZSBpbnRlcnZhbCwgZ290ICR7SlNPTi5zdHJpbmdpZnkodW5kZWYpfWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmF0b3JGcm9tS2V5PFQsIFU+KGtleUZuOiAoeDogVCkgPT4gVSkge1xuICByZXR1cm4gKGE6IFQsIGI6IFQpID0+IHtcbiAgICBjb25zdCBrZXlBID0ga2V5Rm4oYSk7XG4gICAgY29uc3Qga2V5QiA9IGtleUZuKGIpO1xuXG4gICAgaWYgKGtleUEgPCBrZXlCKSB7IHJldHVybiAtMTsgfVxuICAgIGlmIChrZXlBID09PSBrZXlCKSB7IHJldHVybiAwOyB9XG4gICAgcmV0dXJuIDE7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb3BhZ2F0ZUJvdW5kcyhpbnRlcnZhbHM6IFNjYWxpbmdJbnRlcnZhbFtdKSB7XG4gIGxldCByZXQgPSBmYWxzZTtcblxuICAvLyBQcm9wYWdhdGUgdXBwZXIgYm91bmRzIHVwd2FyZHNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnRlcnZhbHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgaWYgKGludGVydmFsc1tpXS51cHBlciAhPT0gdW5kZWZpbmVkICYmIGludGVydmFsc1tpICsgMV0ubG93ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaW50ZXJ2YWxzW2kgKyAxXSA9IHsgLi4uaW50ZXJ2YWxzW2kgKyAxXSwgbG93ZXI6IGludGVydmFsc1tpXS51cHBlciB9O1xuICAgICAgcmV0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBQcm9wYWdhdGUgbG93ZXIgYm91bmRzIGRvd253YXJkc1xuICBmb3IgKGxldCBpID0gaW50ZXJ2YWxzLmxlbmd0aCAtIDE7IGkgPj0gMTsgaS0tKSB7XG4gICAgaWYgKGludGVydmFsc1tpXS5sb3dlciAhPT0gdW5kZWZpbmVkICYmIGludGVydmFsc1tpIC0gMV0udXBwZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaW50ZXJ2YWxzW2kgLSAxXSA9IHsgLi4uaW50ZXJ2YWxzW2kgLSAxXSwgdXBwZXI6IGludGVydmFsc1tpXS5sb3dlciB9O1xuICAgICAgcmV0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIFdoZXRoZXIgdHdvIGludGVydmFscyBvdmVybGFwXG4gKi9cbmZ1bmN0aW9uIG92ZXJsYXAoYTogQ29tcGxldGVTY2FsaW5nSW50ZXJ2YWwsIGI6IENvbXBsZXRlU2NhbGluZ0ludGVydmFsKSB7XG4gIHJldHVybiBhLmxvd2VyIDwgYi51cHBlciAmJiBhLnVwcGVyID4gYi5sb3dlcjtcbn1cblxuZnVuY3Rpb24gbGFzdDxUPih4czogVFtdKSB7XG4gIHJldHVybiB4c1t4cy5sZW5ndGggLSAxXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbGFybXMge1xuICByZWFkb25seSBsb3dlckFsYXJtSW50ZXJ2YWxJbmRleD86IG51bWJlcjtcbiAgcmVhZG9ubHkgdXBwZXJBbGFybUludGVydmFsSW5kZXg/OiBudW1iZXI7XG59XG5cbi8qKlxuICogTG9jYXRlIHRoZSBpbnRlcnZhbHMgdGhhdCBzaG91bGQgaGF2ZSB0aGUgYWxhcm0gdGhyZXNob2xkcywgYnkgaW5kZXguXG4gKlxuICogUGljayB0aGUgaW50ZXJ2YWxzIG9uIGVpdGhlciBzaWRlIG9mIHRoZSBzaW5nbGV0b24gXCJ1bmRlZmluZWRcIiBpbnRlcnZhbCwgb3JcbiAqIHBpY2sgdGhlIG1pZGRsZSBpbnRlcnZhbCBpZiB0aGVyZSdzIG5vIHN1Y2ggaW50ZXJ2YWwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQWxhcm1UaHJlc2hvbGRzKGludGVydmFsczogQ29tcGxldGVTY2FsaW5nSW50ZXJ2YWxbXSk6IEFsYXJtcyB7XG4gIGNvbnN0IGdhcEluZGV4ID0gaW50ZXJ2YWxzLmZpbmRJbmRleCh4ID0+IHguY2hhbmdlID09PSB1bmRlZmluZWQpO1xuXG4gIGlmIChnYXBJbmRleCAhPT0gLTEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG93ZXJBbGFybUludGVydmFsSW5kZXg6IGdhcEluZGV4ID4gMCA/IGdhcEluZGV4IC0gMSA6IHVuZGVmaW5lZCxcbiAgICAgIHVwcGVyQWxhcm1JbnRlcnZhbEluZGV4OiBnYXBJbmRleCA8IGludGVydmFscy5sZW5ndGggLSAxID8gZ2FwSW5kZXggKyAxIDogdW5kZWZpbmVkLFxuICAgIH07XG4gIH1cblxuICBpZiAoaW50ZXJ2YWxzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiB7IHVwcGVyQWxhcm1JbnRlcnZhbEluZGV4OiAwIH07XG4gIH1cblxuICBjb25zdCBtaWRkbGVJbmRleCA9IE1hdGguZmxvb3IoaW50ZXJ2YWxzLmxlbmd0aCAvIDIpO1xuXG4gIHJldHVybiB7XG4gICAgbG93ZXJBbGFybUludGVydmFsSW5kZXg6IG1pZGRsZUluZGV4IC0gMSxcbiAgICB1cHBlckFsYXJtSW50ZXJ2YWxJbmRleDogbWlkZGxlSW5kZXgsXG4gIH07XG59Il19