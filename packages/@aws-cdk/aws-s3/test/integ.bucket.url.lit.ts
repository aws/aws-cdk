import cdk = require('@aws-cdk/core');
import s3 = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    new cdk.CfnOutput(this, 'BucketURL', { value: bucket.bucketWebsiteUrl });
    new cdk.CfnOutput(this, 'ObjectURL', { value: bucket.urlForObject('myfolder/myfile.txt') });
    /// !hide
  }
}

const app = new cdk.App();
new TestStack(app, 'aws-cdk-s3-urls');
app.synth();
