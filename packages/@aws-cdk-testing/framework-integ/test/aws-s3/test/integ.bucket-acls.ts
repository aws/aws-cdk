import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

class TestCase extends cdk.Stack {
  constructor(scope: Construct, id: s3.BucketAccessControl, props?: cdk.StackProps) {
    super(scope, id, props);
    new s3.Bucket(this, 'IntegBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      accessControl: id,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
    });
  }
}

new integ.IntegTest(app, 'integ-test', {
  testCases: [
    new TestCase(app, s3.BucketAccessControl.PRIVATE),
    new TestCase(app, s3.BucketAccessControl.BUCKET_OWNER_READ),
    new TestCase(app, s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL),
  ],
});
