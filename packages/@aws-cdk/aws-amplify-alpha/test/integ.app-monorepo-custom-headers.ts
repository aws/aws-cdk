import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as amplify from '../lib';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, 'App', {
      buildSpec: BuildSpec.fromObjectToYaml({
        version: '1.0',
        applications: [
          {
            appRoot: 'frontend',
            frontend: {
              phases: {
                preBuild: {
                  commands: ['npm install'],
                },
                build: {
                  commands: ['npm run build'],
                },
              },
            },
          },
          {
            appRoot: 'backend',
            backend: {
              phases: {
                preBuild: {
                  commands: ['npm install'],
                },
                build: {
                  commands: ['npm run build'],
                },
              },
            },
          },
        ],
      }),
      customResponseHeaders: [
        {
          appRoot: 'frontend',
          pattern: '*.json',
          headers: {
            'custom-header-name-1': 'custom-header-value-1',
            'custom-header-name-2': 'custom-header-value-2',
          },
        },
        {
          appRoot: 'backend',
          pattern: '/path/*',
          headers: {
            'custom-header-name-1': 'custom-header-value-2',
            'x-aws-url-suffix': `this-is-the-suffix-${Stack.of(this).urlSuffix}`,
          },
        },
      ],
      platform: amplify.Platform.WEB_COMPUTE,
    });

    amplifyApp.addBranch('main');
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-amplify-monorepo-custom-headers');

new IntegTest(app, 'amplify-app-monorepo-custom-headers-integ', {
  testCases: [stack],
});
