import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as amplify from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const computeRole = new iam.Role(this, 'ComputeRole', {
      assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
    });

    const amplifyApp = new amplify.App(this, 'App', {
      platform: amplify.Platform.WEB_COMPUTE,
      computeRole,
    });

    amplifyApp.addBranch('main');
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-amplify-app-compute-role');

new IntegTest(app, 'amplify-app-compute-role-integ', {
  testCases: [stack],
  enableLookups: true,
  stackUpdateWorkflow: false,
});
