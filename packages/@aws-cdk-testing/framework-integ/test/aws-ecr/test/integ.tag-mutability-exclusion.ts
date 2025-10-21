import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecr-tag-mutability-exclusion-stack');

new ecr.Repository(stack, 'ImmutableRepoWithExclusions', {
  imageTagMutability: ecr.TagMutability.IMMUTABLE_WITH_EXCLUSION,
  imageTagMutabilityExclusionFilters: [
    ecr.ImageTagMutabilityExclusionFilter.wildcard('dev-*'),
    ecr.ImageTagMutabilityExclusionFilter.wildcard('test-*'),
  ],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  emptyOnDelete: true,
});

new ecr.Repository(stack, 'MutableRepoWithExclusions', {
  imageTagMutability: ecr.TagMutability.MUTABLE_WITH_EXCLUSION,
  imageTagMutabilityExclusionFilters: [
    ecr.ImageTagMutabilityExclusionFilter.wildcard('prod-*'),
    ecr.ImageTagMutabilityExclusionFilter.wildcard('release-v*'),
  ],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  emptyOnDelete: true,
});

new IntegTest(app, 'cdk-ecr-tag-mutability-exclusion-test', {
  testCases: [stack],
});
