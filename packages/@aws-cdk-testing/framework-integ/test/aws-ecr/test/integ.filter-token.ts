import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'EcrFilterToken');

const pattern = new cdk.CfnParameter(stack, 'Pattern');

new ecr.Repository(stack, 'Repo', {
  imageTagMutability: ecr.TagMutability.IMMUTABLE_WITH_EXCLUSION,
  imageTagMutabilityExclusionFilters: [
    ecr.ImageTagMutabilityExclusionFilter.wildcard(pattern.valueAsString),
  ],
});

new IntegTest(app, 'ecr-filter-token', {
  testCases: [stack],
});
