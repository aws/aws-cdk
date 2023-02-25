import * as fc from 'fast-check';
import * as scalingcommon from '../lib';

export class ArbitraryCompleteIntervals extends fc.Arbitrary<scalingcommon.CompleteScalingInterval[]> {
  public generate(mrng: fc.Random): fc.Shrinkable<scalingcommon.CompleteScalingInterval[]> {
    const ret = scalingcommon.generateArbitraryIntervals(mrng);
    return new fc.Shrinkable(scalingcommon.normalizeIntervals(ret.intervals, ret.absolute));
  }
}

export function arbitrary_complete_intervals() {
  return new ArbitraryCompleteIntervals();
}
