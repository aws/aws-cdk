import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

/**
 * Integration test for BucketDeployment with an empty sources array.
 * Validates that starting with sources: [] deploys successfully without errors.
 */
class TestBucketDeploymentEmptySources extends cdk.Stack {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'Destination', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3deploy.BucketDeployment(this, 'DeployEmptySources', {
      sources: [],
      destinationBucket: this.bucket,
      retainOnDelete: false,
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestBucketDeploymentEmptySources(app, 'test-bucket-deployment-empty-sources');

new integ.IntegTest(app, 'integ-test-bucket-deployment-empty-sources', {
  testCases: [testCase],
});

app.synth();
