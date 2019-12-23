import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as path from 'path';
import * as assets from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const asset = new assets.Asset(this, 'SampleAsset', {
      path: path.join(__dirname, 'parcel-main/index.ts'),
      bundler: new cxapi.ParcelBundler({
        global: 'addMult',
      })
    });

    const user = new iam.User(this, 'MyUser');
    asset.grantRead(user);
  }
}

const app = new cdk.App();
new TestStack(app, 'aws-cdk-asset-parcel-test');
app.synth();
