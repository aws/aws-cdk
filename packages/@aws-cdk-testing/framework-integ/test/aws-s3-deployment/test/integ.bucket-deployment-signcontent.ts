import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

class TestBucketDeployment extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Destination', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    const deployment = new s3deploy.BucketDeployment(this, 'Deployment', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      signContent: true,
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });

    // The above code would be sufficient for an integration test to detect template changes,
    // and the stack would deploy successfully, but it would not test functionality because
    // PutObject payload signing is not mandatory unless enforced via custom resource policy.
    // With this as a dependency, successful deployment proves that the payloads were signed.
    const policyResult = bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:PutObject'],
        resources: [`${bucket.bucketArn}/*`],
        conditions: {
          StringNotLike: {
            's3:x-amz-content-sha256': [
              '[A-Fa-f0-9]{64}', // Regular SHA256 hash
              'STREAMING-*', // Streaming upload format
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

new integ.IntegTest(app, 'integ-test-bucket-deployments', {
  testCases: [testCase],
  diffAssets: true,
});
