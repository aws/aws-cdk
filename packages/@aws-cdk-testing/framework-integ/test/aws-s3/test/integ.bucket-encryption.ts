import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3-bucket-encryption');

const dsseBucket = new s3.Bucket(stack, 'MyDSSEBucket', {
  encryption: s3.BucketEncryption.DSSE_MANAGED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const sseS3Bucket = new s3.Bucket(stack, 'MySSES3Bucket', {
  encryption: s3.BucketEncryption.S3_MANAGED,
  bucketKeyEnabled: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const kmsBucket = new s3.Bucket(stack, 'MyKMSBucket', {
  encryption: s3.BucketEncryption.KMS,
  blockedEncryptionTypes: [s3.BlockedEncryptionType.NONE],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

kmsBucket.encryptionKey?.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

new s3.Bucket(stack, 'MySSECBlockedBucket', {
  encryption: s3.BucketEncryption.S3_MANAGED,
  blockedEncryptionTypes: [s3.BlockedEncryptionType.SSE_C],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const test = new integ.IntegTest(app, 'IntegTestDSSEBucket', {
  testCases: [stack],
});

// Check that the encryption mode the reflection reports matches what S3 applied to each deployed bucket.
const sseAlgorithmByEncryption: Partial<Record<s3.BucketEncryption, string>> = {
  [s3.BucketEncryption.S3_MANAGED]: 'AES256',
  [s3.BucketEncryption.KMS]: 'aws:kms',
  [s3.BucketEncryption.DSSE_MANAGED]: 'aws:kms:dsse',
};

// MySSECBlockedBucket is intentionally synth-only: blockedEncryptionTypes doesn't affect the reflected encryption mode.
for (const bucket of [dsseBucket, sseS3Bucket, kmsBucket]) {
  const sseAlgorithm = bucket.encryption && sseAlgorithmByEncryption[bucket.encryption];
  if (!sseAlgorithm) {
    throw new Error(`unexpected encryption mode ${JSON.stringify(bucket.encryption)} for ${bucket.node.path}`);
  }

  test.assertions.awsApiCall('S3', 'getBucketEncryption', { Bucket: bucket.bucketName })
    .expect(integ.ExpectedResult.objectLike({
      ServerSideEncryptionConfiguration: {
        Rules: [{ ApplyServerSideEncryptionByDefault: { SSEAlgorithm: sseAlgorithm } }],
      },
    }));
}
