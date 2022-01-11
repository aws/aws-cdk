import * as cdk from '@aws-cdk/core';
import * as codecommit from '../lib';
import { Code } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codecommit-repo-contents-assets');

new codecommit.Repository(stack, 'Repo', {
  repositoryName: 'aws-cdk-codecommit-repo-contents-assets',
  code: Code.fromDirectory('./asset-test'),
});

app.synth();
