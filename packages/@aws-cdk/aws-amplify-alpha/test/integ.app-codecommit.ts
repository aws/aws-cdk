import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import type { Construct } from 'constructs';
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

    amplifyApp.addBranch('main');
  }
}

const app = new App();
new TestStack(app, 'cdk-amplify-codecommit-app');
app.synth();
