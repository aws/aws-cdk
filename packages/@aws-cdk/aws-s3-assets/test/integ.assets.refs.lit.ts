import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import path = require('path');
import assets = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    const asset = new assets.Asset(this, 'SampleAsset', {
      path: path.join(__dirname, 'sample-asset-directory')
    });

    new cdk.CfnOutput(this, 'S3BucketName', { value: asset.s3BucketName });
    new cdk.CfnOutput(this, 'S3ObjectKey', { value: asset.s3ObjectKey });
    new cdk.CfnOutput(this, 'S3URL', { value: asset.s3Url });
    /// !hide

    // we need at least one resource
    asset.grantRead(new iam.User(this, 'MyUser'));
  }
}

const app = new cdk.App();
new TestStack(app, 'aws-cdk-asset-refs');
app.synth();
