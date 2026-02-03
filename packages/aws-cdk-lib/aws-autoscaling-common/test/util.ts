import * as fc from 'fast-check';
import * as scalingcommon from '../lib';

export class ArbitraryCompleteIntervals extends fc.Arbitrary<scalingcommon.CompleteScalingInterval[]> {
  public generate(mrng: fc.Random): fc.Value<scalingcommon.CompleteScalingInterval[]> {
    const ret = scalingcommon.generateArbitraryIntervals(mrng);
    return new fc.Value(scalingcommon.normalizeIntervals(ret.intervals, ret.absolute), {});
  }

  public canShrinkWithoutContext(_value: unknown): _value is scalingcommon.CompleteScalingInterval[] {
    return false;
  }

  public shrink(_value: scalingcommon.CompleteScalingInterval[], _context: unknown): fc.Stream<fc.Value<scalingcommon.CompleteScalingInterval[]>> {
    return fc.Stream.nil();
  }
}

export function arbitrary_complete_intervals() {
  return new ArbitraryCompleteIntervals();
}
