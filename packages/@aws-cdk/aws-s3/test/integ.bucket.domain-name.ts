import cdk = require('@aws-cdk/cdk');
import s3 = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.Destroy
    });
    const bucket2 = s3.Bucket.fromBucketAttributes(this, "MyBucket2", {
      bucketArn: "arn:aws:s3:::my-bucket-test"
    });

    new cdk.CfnOutput(this, 'RealBucketDomain', { value: bucket.bucketDomainName });
    new cdk.CfnOutput(this, 'ImportedBucketDomain', { value: bucket2.bucketDomainName });
    /// !hide
  }
}

const app = new cdk.App();
new TestStack(app, 'aws-cdk-s3-urls');
app.run();
