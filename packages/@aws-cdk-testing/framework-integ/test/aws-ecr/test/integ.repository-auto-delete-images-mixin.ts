import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecr-auto-delete-images-mixin-stack');

const repo = new ecr.CfnRepository(stack, 'Repo', {
  repositoryName: 'delete-even-if-containing-images-mixin',
});
repo.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
repo.with(new ecr.mixins.RepositoryAutoDeleteImages());

new cdk.CfnOutput(stack, 'RepositoryName', {
  value: repo.ref,
});

new IntegTest(app, 'cdk-integ-auto-delete-images-mixin', {
  testCases: [stack],
  diffAssets: true,
});
