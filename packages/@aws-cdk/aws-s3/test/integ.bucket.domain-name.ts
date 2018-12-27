import cdk = require('@aws-cdk/cdk');
import s3 = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, scid: string) {
    super(scope, scid);

    /// !show
    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.Destroy
    });
    const bucket2 = s3.Bucket.import(this, "MyBucket2", {
      bucketArn: "arn:aws:s3:::my-bucket-test"
    });

    new cdk.Output(this, 'RealBucketDomain', { value: bucket.domainName });
    new cdk.Output(this, 'ImportedBucketDomain', { value: bucket2.domainName });
    /// !hide
  }
}

const app = new cdk.App();
new TestStack(app, 'aws-cdk-s3-urls');
app.run();
