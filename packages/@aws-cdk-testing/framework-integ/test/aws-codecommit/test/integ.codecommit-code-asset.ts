import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { Code } from 'aws-cdk-lib/aws-codecommit';
import * as path from 'path';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codecommit-repo-contents-assets');

new codecommit.Repository(stack, 'Repo', {
  repositoryName: 'aws-cdk-codecommit-repo-contents-assets',
  code: Code.fromDirectory(path.join(__dirname, 'asset-test')),
});

app.synth();
