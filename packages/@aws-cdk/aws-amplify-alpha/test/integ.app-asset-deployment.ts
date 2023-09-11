import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as amplify from '../lib';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Deploying this integ test would create an Amplify app with branch name 'main'
    // Re-deploying the stack again after updating the asset file would update the Amplify app.
    //
    const asset = new Asset(this, 'SampleAsset', {
      path: path.join(__dirname, './test-asset'),
    });

    const amplifyApp = new amplify.App(this, 'App', {});
    amplifyApp.addBranch('main', { asset });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-amplify-app-asset-deployment');
new IntegTest(app, 'cdk-amplify-app-integ-test', {
  testCases: [stack],
});