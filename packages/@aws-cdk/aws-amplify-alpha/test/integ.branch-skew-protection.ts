import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as amplify from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, 'App', {
      cacheConfigType: amplify.CacheConfigType.AMPLIFY_MANAGED_NO_COOKIES,
    });

    amplifyApp.addBranch('main', { skewProtection: true });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-amplify-branch-skew-protection');

new IntegTest(app, 'amplify-branch-skew-protection', {
  testCases: [stack],
});
