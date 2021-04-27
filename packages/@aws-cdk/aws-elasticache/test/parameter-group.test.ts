import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { CacheParameterGroupFamily, ParameterGroup } from '../lib';

test('create a cache parameter group', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new ParameterGroup(stack, 'Params', {
    description: 'desc',
    cacheParameterGroupFamily: CacheParameterGroupFamily.REDIS_5_0,
    properties: {
      param: 'value',
    },
  });

  // THEN
  cdkExpect(stack).to(
    haveResource('AWS::ElastiCache::ParameterGroup', {
      Description: 'desc',
      CacheParameterGroupFamily: 'redis5.0',
      Properties: {
        param: 'value',
      },
    }),
  );
});
