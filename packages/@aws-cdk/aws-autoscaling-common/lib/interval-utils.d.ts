import { ScalingInterval } from './types';
export interface CompleteScalingInterval {
    readonly lower: number;
    readonly upper: number;
    readonly change?: number;
}
/**
 * Normalize the given interval set to cover the complete number line and make sure it has at most one gap
 */
export declare function normalizeIntervals(intervals: ScalingInterval[], changesAreAbsolute: boolean): CompleteScalingInterval[];
export interface Alarms {
    readonly lowerAlarmIntervalIndex?: number;
    readonly upperAlarmIntervalIndex?: number;
}
/**
 * Locate the intervals that should have the alarm thresholds, by index.
 *
 * Pick the intervals on either side of the singleton "undefined" interval, or
 * pick the middle interval if there's no such interval.
 */
export declare function findAlarmThresholds(intervals: CompleteScalingInterval[]): Alarms;
