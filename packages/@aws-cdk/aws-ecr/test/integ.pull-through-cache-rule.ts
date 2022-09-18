/// !cdk-integ aws-ecr-pull-through-cache-rule
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as ecr from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-ecr-pull-through-cache-rule');

new ecr.PullThroughCacheRule(stack, 'PullThroughCacheRule', {
  ecrRepositoryPrefix: 'my-ecr',
  upstreamRegistryUrl: 'public.ecr.aws',
});

new integ.IntegTest(app, 'PullThroughCacheRuleTest', {
  testCases: [stack],
});

app.synth();