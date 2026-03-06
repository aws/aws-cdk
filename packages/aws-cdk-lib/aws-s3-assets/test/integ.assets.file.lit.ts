import * as path from 'path';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as assets from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const user = new iam.User(this, 'MyUser');

    /// !show
    for (let i = 0; i < 1000; i++) {
      const asset = new assets.Asset(this, `SampleAsset${i}`, {
        path: path.join(__dirname, 'file-asset.txt'),

        // Optional: describe the purpose of the asset with a human-readable string
        displayName: 'My file',
      });
      /// !hide

      asset.grantRead(user);
    }
  }
}

const app = new cdk.App();
new TestStack(app, 'aws-cdk-asset-file-test');

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('v8').writeHeapSnapshot();

app.synth();
