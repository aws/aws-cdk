import * as path from 'path';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

/**
 * Integration test for bucket deployment with CloudFront distribution invalidation:
 * - Deploys files to S3 bucket behind CloudFront distribution
 * - Tests that CloudFront cache invalidation works with bucket deployments
 */
class TestBucketDeploymentCloudFront extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Destination', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
      },
    });

    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/images/*.png'],
      retainOnDelete: false,
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const testCase = new TestBucketDeploymentCloudFront(app, 'test-bucket-deployment-cloudfront');

new integ.IntegTest(app, 'integ-test-bucket-deployment-cloudfront', {
  testCases: [testCase],
  diffAssets: true,
});

app.synth();
