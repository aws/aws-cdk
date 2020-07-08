import * as codecommit from '@aws-cdk/aws-codecommit';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as amplify from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const repository = new codecommit.Repository(this, 'Repo', {
      repositoryName: 'integ-amplify-app',
    });

    const amplifyApp = new amplify.App(this, 'App', {
      sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({ repository }),
    });

    amplifyApp.addBranch('master');
  }
}

const app = new App();
new TestStack(app, 'cdk-amplify-codecommit-app');
app.synth();
