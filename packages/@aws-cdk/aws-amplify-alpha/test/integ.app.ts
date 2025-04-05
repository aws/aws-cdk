import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as amplify from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, 'App', {
      basicAuth: amplify.BasicAuth.fromGeneratedPassword('aws'),
      autoBranchCreation: {},
      customResponseHeaders: [
        {
          pattern: '*.json',
          headers: {
            'custom-header-name-1': 'custom-header-value-1',
            'custom-header-name-2': 'custom-header-value-2',
          },
        },
        {
          pattern: '/path/*',
          headers: {
            'custom-header-name-1': 'custom-header-value-2',
            'x-aws-url-suffix': `this-is-the-suffix-${Stack.of(this).urlSuffix}`,
          },
        },
      ],
      platform: amplify.Platform.WEB_COMPUTE,
    });

    amplifyApp.addCustomRule({
      source: '/source',
      status: amplify.RedirectStatus.PERMANENT_REDIRECT,
      target: '/target',
    });

    const mainBranch = amplifyApp.addBranch('main');
    mainBranch.addEnvironment('key', 'value');
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-amplify-app');

new IntegTest(app, 'cdk-amplify-app-integ', {
  testCases: [stack],
  enableLookups: true,
  stackUpdateWorkflow: false,
});
