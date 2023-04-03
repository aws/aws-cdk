import * as fc from 'fast-check';
import * as scalingcommon from '../lib';
export declare class ArbitraryCompleteIntervals extends fc.Arbitrary<scalingcommon.CompleteScalingInterval[]> {
    generate(mrng: fc.Random): fc.Shrinkable<scalingcommon.CompleteScalingInterval[]>;
}
export declare function arbitrary_complete_intervals(): ArbitraryCompleteIntervals;
