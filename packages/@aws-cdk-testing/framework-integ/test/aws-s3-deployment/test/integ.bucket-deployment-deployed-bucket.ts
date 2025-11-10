import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

/**
 * Integration test for deployedBucket property:
 * - Tests that deployedBucket provides access to bucket after deployment completes
 * - Validates that bucket properties like bucketWebsiteUrl can be accessed via deployedBucket
 */
class TestBucketDeployment extends cdk.Stack {
  public readonly bucket: s3.IBucket;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'Destination', {
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    const deployment = new s3deploy.BucketDeployment(this, 'DeployWithDeployedBucket', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website-second'))],
      destinationBucket: this.bucket,
      retainOnDelete: false,
    });

    // Export the website URL accessed via deployedBucket property
    this.exportValue(deployment.deployedBucket.bucketWebsiteUrl, {
      name: 'WebsiteUrl',
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestBucketDeployment(app, 'test-bucket-deployment-deployed-bucket');

new integ.IntegTest(app, 'integ-test-bucket-deployment-deployed-bucket', {
  testCases: [testCase],
  diffAssets: true,
});

app.synth();
