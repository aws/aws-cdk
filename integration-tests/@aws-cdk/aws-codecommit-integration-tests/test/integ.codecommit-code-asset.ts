import * as codecommit from '@aws-cdk/aws-codecommit';
import { Code } from '@aws-cdk/aws-codecommit';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codecommit-repo-contents-assets');

new codecommit.Repository(stack, 'Repo', {
  repositoryName: 'aws-cdk-codecommit-repo-contents-assets',
  code: Code.fromDirectory('./asset-test'),
});

app.synth();
