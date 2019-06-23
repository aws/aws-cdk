import scalingcommon = require('@aws-cdk/aws-autoscaling-common');
import cdk = require('@aws-cdk/core');
import fc = require('fast-check');
import appscaling = require('../lib');
import { ServiceNamespace } from '../lib';

export function createScalableTarget(scope: cdk.Construct) {
  return new appscaling.ScalableTarget(scope, 'Target', {
    serviceNamespace: ServiceNamespace.DYNAMODB,
    scalableDimension: 'test:TestCount',
    resourceId: 'test:this/test',
    minCapacity: 1,
    maxCapacity: 20,
  });
}

export class ArbitraryInputIntervals extends fc.Arbitrary<appscaling.ScalingInterval[]> {
  public generate(mrng: fc.Random): fc.Shrinkable<appscaling.ScalingInterval[]> {
    const ret = scalingcommon.generateArbitraryIntervals(mrng);
    return new fc.Shrinkable(ret.intervals);
  }
}

export function arbitrary_input_intervals() {
  return new ArbitraryInputIntervals();
}
