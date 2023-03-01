import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as ecr from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecr-integ-stack');

const repo = new ecr.Repository(stack, 'Repo');
repo.addLifecycleRule({ maxImageCount: 5 });
repo.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['ecr:GetDownloadUrlForLayer'],
  principals: [new iam.AnyPrincipal()],
}));

new cdk.CfnOutput(stack, 'RepositoryURI', {
  value: repo.repositoryUri,
});

new IntegTest(app, 'cdk-ecr-integ-test-basic', {
  testCases: [stack],
});
