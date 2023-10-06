import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { Code } from 'aws-cdk-lib/aws-codecommit';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codecommit-repo-contents-zip-file');

new codecommit.Repository(stack, 'Repo', {
  repositoryName: 'aws-cdk-codecommit-repo-contents-zip-file',
  code: Code.fromZipFile('./asset-test.zip'),
});

app.synth();
