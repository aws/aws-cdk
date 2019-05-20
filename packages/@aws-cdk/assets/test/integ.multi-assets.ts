import cdk = require('@aws-cdk/cdk');
import path = require('path');
import assets = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Check that the same asset added multiple times is
    // uploaded and copied.
    new assets.FileAsset(this, 'SampleAsset1', {
      path: path.join(__dirname, 'file-asset.txt')
    });

    new assets.FileAsset(this, 'SampleAsset2', {
      path: path.join(__dirname, 'file-asset.txt')
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'aws-cdk-multi-assets');
app.run();