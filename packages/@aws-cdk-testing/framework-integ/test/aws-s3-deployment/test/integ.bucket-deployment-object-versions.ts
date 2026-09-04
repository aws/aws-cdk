import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

/**
 * Integration test for the `objectVersionIds` accessor.
 *
 * Deploys a single zip (extract: false) to a versioned bucket and asserts that the version ID
 * returned by `BucketDeployment.objectVersionIds` matches the version ID S3 actually assigned to
 * the deployed object (obtained via a `headObject` call after deployment).
 */
class TestBucketDeployment extends cdk.Stack {
  public readonly objectKey: string;
  public readonly objectVersionId: string;
  public readonly bucketName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Destination', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    const deployment = new s3deploy.BucketDeployment(this, 'DeployZip', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      extract: false,
      retainOnDelete: false,
    });

    this.bucketName = bucket.bucketName;
    // `objectKeys`/`objectVersionIds` are GetAtt lists. A list cannot be exported across a stack
    // boundary as an Output (Outputs must be strings), so export the already-selected scalar — this
    // is what the assertion stack imports.
    this.objectKey = this.exportValue(cdk.Fn.select(0, deployment.objectKeys), { name: 'DeployedObjectKey' });
    this.objectVersionId = this.exportValue(cdk.Fn.select(0, deployment.objectVersionIds), { name: 'DeployedObjectVersionId' });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const testCase = new TestBucketDeployment(app, 'test-bucket-deployment-object-versions');

const test = new integ.IntegTest(app, 'integ-test-bucket-deployment-object-versions', {
  testCases: [testCase],
  diffAssets: true,
});

// Ground truth: ask S3 for the current version of the deployed object, and assert it equals the
// version ID surfaced by `objectVersionIds`. If the feature returned the wrong (or empty) version,
// this assertion fails.
const head = test.assertions.awsApiCall('S3', 'headObject', {
  Bucket: testCase.bucketName,
  Key: testCase.objectKey,
});
// `headObject` requires `s3:GetObject`, but the auto-derived policy action would be the
// non-existent `s3:HeadObject`, so grant the correct permission explicitly.
head.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:GetObject', 's3:GetObjectVersion'],
  Resource: ['*'],
});
head.expect(integ.ExpectedResult.objectLike({
  VersionId: testCase.objectVersionId,
}));

app.synth();
