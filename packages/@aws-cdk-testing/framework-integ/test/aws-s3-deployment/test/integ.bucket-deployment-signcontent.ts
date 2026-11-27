import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { Construct } from 'constructs';

/**
 * Integration test for bucket deployment with content signing:
 * - Lambda function signs PutObject payloads before uploading to S3
 * - Tests signContent flag by enforcing signed payloads via bucket policy
 * - Successful deployment proves that payloads were properly signed
 */
class TestBucketDeployment extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Destination', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    const deployment = new s3deploy.BucketDeployment(this, 'DeployWithSignedContent', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      signContent: true,
      retainOnDelete: false,
    });

    // PutObject payload signing is not mandatory unless enforced via bucket policy.
    // With this policy dependency, successful deployment proves that the payloads were signed.
    const policyResult = bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:PutObject'],
        resources: [`${bucket.bucketArn}/*`],
        // Deny the unsigned values rather than allow-listing signed ones: IAM `StringLike` has
        // no regex to match a hex hash, and a `STREAMING-*` wildcard would also admit
        // `STREAMING-UNSIGNED-PAYLOAD-TRAILER`.
        conditions: {
          StringEquals: {
            's3:x-amz-content-sha256': [
              'UNSIGNED-PAYLOAD',
              'STREAMING-UNSIGNED-PAYLOAD-TRAILER',
            ],
          },
        },
      }),
    );
    deployment.node.addDependency(policyResult.policyDependable!);
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestBucketDeployment(app, 'test-bucket-deployment-signobject');

new integ.IntegTest(app, 'integ-test-bucket-deployment-signcontent', {
  testCases: [testCase],
  diffAssets: true,
});

app.synth();
