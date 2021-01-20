/// !cdk-integ pragma:ignore-assets
import * as cdk from '@aws-cdk/core';
import * as ecr from '../lib';

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

app.synth();
