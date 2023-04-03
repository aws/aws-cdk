import * as appscaling from '../lib';
/**
 * Arbitrary (valid) array of intervals
 *
 * There are many invalid combinations of interval arrays, so we have
 * to be very specific about generating arrays that are valid. We do this
 * by taking a full, valid interval schedule and progressively stripping parts
 * away from it.
 *
 * Some of the changes may change its meaning, but we take care to never leave
 * a schedule with insufficient information so that the parser will error out.
 */
export declare function generateArbitraryIntervals(mrng: IRandomGenerator): ArbitraryIntervals;
export interface IRandomGenerator {
    nextBoolean(): boolean;
    nextInt(min: number, max: number): number;
}
export interface ArbitraryIntervals {
    readonly absolute: boolean;
    readonly intervals: appscaling.ScalingInterval[];
}
