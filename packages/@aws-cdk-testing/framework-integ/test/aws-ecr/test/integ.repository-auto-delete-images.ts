import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecr-integ-stack');

const repo = new ecr.Repository(stack, 'Repo', {
  repositoryName: 'delete-even-if-containing-images',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteImages: true,
});

new cdk.CfnOutput(stack, 'RepositoryURI', {
  value: repo.repositoryUri,
});

new IntegTest(app, 'cdk-integ-auto-delete-images', {
  testCases: [stack],
  diffAssets: true,
});
