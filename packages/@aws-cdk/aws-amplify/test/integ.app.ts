import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as amplify from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, 'App', {
      basicAuth: amplify.BasicAuth.fromGeneratedPassword('aws'),
      autoBranchCreation: {},
      customHeaders: [
        {
          pattern: '*.json',
          headers: [
            { key: 'custom-header-name-1', value: 'custom-header-value-1' },
            { key: 'custom-header-name-2', value: 'custom-header-value-2' },
          ],
        },
        {
          pattern: '/path/*',
          headers: [
            { key: 'custom-header-name-1', value: 'custom-header-value-2' },
          ],
        },
      ],
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
