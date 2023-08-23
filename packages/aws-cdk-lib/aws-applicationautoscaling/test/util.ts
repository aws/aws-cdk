import * as constructs from 'constructs';
import * as fc from 'fast-check';
import * as scalingcommon from '../../aws-autoscaling-common';
import * as appscaling from '../lib';

export function createScalableTarget(scope: constructs.Construct) {
  return new appscaling.ScalableTarget(scope, 'Target', {
    serviceNamespace: appscaling.ServiceNamespace.DYNAMODB,
    scalableDimension: 'test:TestCount',
    resourceId: 'test:this/test',
    minCapacity: 1,
    maxCapacity: 20,
  });
}

export class ArbitraryInputIntervals extends fc.Arbitrary<appscaling.ScalingInterval[]> {
  public generate(mrng: fc.Random): fc.Value<appscaling.ScalingInterval[]> {
    const ret = scalingcommon.generateArbitraryIntervals(mrng);
    return new fc.Value(ret.intervals, {});
  }

  public canShrinkWithoutContext(_value: unknown): _value is appscaling.ScalingInterval[] {
    return false;
  }

  public shrink(_value: appscaling.ScalingInterval[], _context: unknown): fc.Stream<fc.Value<appscaling.ScalingInterval[]>> {
    return fc.Stream.nil();
  }
}

export function arbitrary_input_intervals() {
  return new ArbitraryInputIntervals();
}
