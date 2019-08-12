import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import path = require('path');
import assets = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The template must contain at least one resource, so there is this...
    new iam.User(this, 'DummyResource');

    // Check that the same asset added multiple times is
    // uploaded and copied.
    new assets.Asset(this, 'SampleAsset1', {
      path: path.join(__dirname, 'file-asset.txt')
    });

    new assets.Asset(this, 'SampleAsset2', {
      path: path.join(__dirname, 'file-asset.txt')
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'aws-cdk-multi-assets');
app.synth();
