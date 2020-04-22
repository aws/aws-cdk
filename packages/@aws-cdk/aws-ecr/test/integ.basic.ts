import * as cdk from '@aws-cdk/core';
import * as ecr from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecr-integ-stack');

const repo = new ecr.Repository(stack, 'Repo');
repo.addLifecycleRule({ maxImageCount: 5 });

new cdk.CfnOutput(stack, 'RepositoryURI', {
  value: repo.repositoryUri,
});

app.synth();
