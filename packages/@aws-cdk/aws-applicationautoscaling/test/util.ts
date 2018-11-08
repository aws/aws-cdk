import cdk = require('@aws-cdk/cdk');
import appscaling = require('../lib');
import { ServiceNamespace } from '../lib';

export function createScalableTarget(parent: cdk.Construct) {
  return new appscaling.ScalableTarget(parent, 'Target', {
    serviceNamespace: ServiceNamespace.DynamoDb,
    scalableDimension: 'test:TestCount',
    resourceId: 'test:this/test',
    minCapacity: 1,
    maxCapacity: 20,
  });
}
