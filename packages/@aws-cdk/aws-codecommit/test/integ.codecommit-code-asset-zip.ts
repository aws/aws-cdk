import * as cdk from '@aws-cdk/core';
import * as codecommit from '../lib';
import { Code } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codecommit-repo-contents-zip-file');

new codecommit.Repository(stack, 'Repo', {
  repositoryName: 'aws-cdk-codecommit-repo-contents-zip-file',
  code: Code.fromZipFile('./asset-test.zip'),
});

app.synth();
