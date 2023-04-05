import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as assets from 'aws-cdk-lib/aws-s3-assets';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    const asset = new assets.Asset(this, 'SampleAsset', {
      path: path.join(__dirname, 'sample-asset-directory'),
    });

    new cdk.CfnOutput(this, 'S3BucketName', { value: asset.s3BucketName });
    new cdk.CfnOutput(this, 'S3ObjectKey', { value: asset.s3ObjectKey });
    new cdk.CfnOutput(this, 'S3HttpURL', { value: asset.httpUrl });
    new cdk.CfnOutput(this, 'S3ObjectURL', { value: asset.s3ObjectUrl });
    /// !hide

    // we need at least one resource
    asset.grantRead(new iam.User(this, 'MyUser'));
  }
}

const app = new cdk.App();
new TestStack(app, 'aws-cdk-asset-refs');
app.synth();
