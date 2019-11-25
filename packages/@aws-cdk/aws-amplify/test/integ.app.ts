import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import amplify = require('../lib');

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, 'App', {
      basicAuth: amplify.BasicAuth.fromGeneratedPassword('aws'),
      autoBranchCreation: {}
    });

    amplifyApp.addCustomRule({
      source: '/source',
      target: '/target',
    });

    const masterBranch = amplifyApp.addBranch('master');
    masterBranch.addEnvironment('key', 'value');
  }
}

const app = new App();
new TestStack(app, 'cdk-amplify-app');
app.synth();
