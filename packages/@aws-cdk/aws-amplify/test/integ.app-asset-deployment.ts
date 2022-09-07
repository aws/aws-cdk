// import * as path from 'path';
// import { Asset } from '@aws-cdk/aws-s3-assets';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as amplify from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // FIXME: currently this is only released as part of amplify-alpha, which cannot be tested here
    // and the asset hash is different in alpha
    //
    // const asset = new Asset(this, 'SampleAsset', {
    //   path: path.join(__dirname, './test-asset'),
    // });

    new amplify.App(this, 'App', {});
    // amplifyApp.addBranch('main', { asset });
  }
}

const app = new App();
new TestStack(app, 'cdk-amplify-app-asset-deployment');
app.synth();
