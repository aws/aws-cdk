import * as path from 'path';
import type { AwsApiCall } from '@aws-cdk/integ-tests-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, DefaultStackSynthesizer, RemovalPolicy, Stack, UnscopedValidationError } from 'aws-cdk-lib';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

// Bootstrap the test environment with --bootstrap-customer-key and provide the
// actual key ARN. A placeholder or unencrypted bootstrap cannot validate this fix.
const app = new App();
const keyArn = app.node.tryGetContext('bootstrapBucketKmsKeyArn');
if (typeof keyArn !== 'string' || !keyArn.includes(':key/') || keyArn.includes('11111111-2222-3333-4444-555555555555')) {
  throw new UnscopedValidationError(lit`MissingBootstrapKmsKey`,
    'provide the real customer-managed bootstrap key ARN as context bootstrapBucketKmsKeyArn');
}
const qualifier = app.node.tryGetContext('bootstrapQualifier') ?? DefaultStackSynthesizer.DEFAULT_QUALIFIER;
const stack = new Stack(app, 'bootstrap-bucket-kms', {
  synthesizer: new DefaultStackSynthesizer({ qualifier, fileAssetsBucketKmsKeyArn: keyArn }),
});
const bucket = new Bucket(stack, 'Destination', {
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
new BucketDeployment(stack, 'Deploy', {
  destinationBucket: bucket,
  sources: [Source.asset(path.join(__dirname, '..', 'my-website'))],
  retainOnDelete: false,
});

const test = new IntegTest(app, 'BootstrapBucketKms', { testCases: [stack] });
const objectCheck = test.assertions.awsApiCall('S3', 'headObject', {
  Bucket: bucket.bucketName,
  Key: 'index.html',
}) as AwsApiCall;
objectCheck.expect(ExpectedResult.objectLike({ ContentType: 'text/html' }))
  .waitForAssertions();

// Verify the source bucket actually uses the supplied CMK. A destination-only
// assertion could pass with an unencrypted source and never exercise KMS access.
const encryptionCheck = test.assertions.awsApiCall('S3', 'getBucketEncryption', {
  Bucket: `cdk-${qualifier}-assets-${stack.account}-${stack.region}`,
}) as AwsApiCall;
encryptionCheck.expect(ExpectedResult.objectLike({
  ServerSideEncryptionConfiguration: {
    Rules: [{ ApplyServerSideEncryptionByDefault: { SSEAlgorithm: 'aws:kms', KMSMasterKeyID: keyArn } }],
  },
})).waitForAssertions();

// These S3 API names differ from their IAM action names; grant the precise
// actions to both the initial call and the retrying assertion provider.
for (const provider of [objectCheck.provider, objectCheck.waiterProvider]) {
  provider?.addToRolePolicy({
    Effect: 'Allow', Action: ['s3:GetObject'], Resource: [bucket.arnForObjects('index.html')],
  });
}
for (const provider of [encryptionCheck.provider, encryptionCheck.waiterProvider]) {
  provider?.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetEncryptionConfiguration'],
    Resource: [`arn:${stack.partition}:s3:::cdk-${qualifier}-assets-${stack.account}-${stack.region}`],
  });
}
