import * as constructs from 'constructs';
import * as fc from 'fast-check';
import * as appscaling from '../lib';
export declare function createScalableTarget(scope: constructs.Construct): appscaling.ScalableTarget;
export declare class ArbitraryInputIntervals extends fc.Arbitrary<appscaling.ScalingInterval[]> {
    generate(mrng: fc.Random): fc.Shrinkable<appscaling.ScalingInterval[]>;
}
export declare function arbitrary_input_intervals(): ArbitraryInputIntervals;
