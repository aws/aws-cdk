import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { PullThroughCacheRule } from '../lib';

describe('pull-through-cache-rule', function () {
  it('should generate the correct resource', function () {
    const stack = new Stack();
    new PullThroughCacheRule(stack, 'PullThroughCacheRule', {
      upstreamRegistryUrl: 'public.ecr.aws',
      ecrRepositoryPrefix: 'my-ecr',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECR::PullThroughCacheRule', {
      EcrRepositoryPrefix: 'my-ecr',
      UpstreamRegistryUrl: 'public.ecr.aws',
    });
  });
});