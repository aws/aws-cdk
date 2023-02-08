import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as amplify from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, 'App', {
      appName: "web-compute-app",
      platform: amplify.AppPlatforms.WEB_COMPUTE
    });

    const mainBranch = amplifyApp.addBranch('main');
    mainBranch.addEnvironment('key', 'value');
  }
}

const app = new App();
new TestStack(app, 'cdk-amplify-app-platform');
app.synth();
