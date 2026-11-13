import * as path from 'path';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, DefaultStackSynthesizer, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

// Before deploying, bootstrap the test environment with --bootstrap-customer-key
// and pass its actual key ARN as context bootstrapBucketKmsKeyArn. The placeholder
// is for credential-free snapshot synthesis only; it is not a deployable key.
const app = new App();
const keyArn = app.node.tryGetContext('bootstrapBucketKmsKeyArn')
  ?? 'arn:${AWS::Partition}:kms:${AWS::Region}:${AWS::AccountId}:key/11111111-2222-3333-4444-555555555555';
const stack = new Stack(app, 'bootstrap-bucket-kms', {
  synthesizer: new DefaultStackSynthesizer({ fileAssetsBucketKmsKeyArn: keyArn }),
});
const bucket = new Bucket(stack, 'Destination', {
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
new BucketDeployment(stack, 'Deploy', {
  destinationBucket: bucket,
  sources: [Source.asset(path.join(__dirname, 'my-website'))],
  retainOnDelete: false,
});

const test = new IntegTest(app, 'BootstrapBucketKms', { testCases: [stack] });
test.assertions.awsApiCall('S3', 'headObject', {
  Bucket: bucket.bucketName,
  Key: 'index.html',
}).expect(ExpectedResult.objectLike({ ContentType: 'text/html' }))
  .waitForAssertions();
