/*
 * Integration tests for Amazon S3 Bucket "Namespaces" feature verification
 * https://docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html
 *
 */

/// !cdk-integ S3-Namespaces-TestStack
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Aws } from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'S3-Namespaces-TestStack');

// bucketNamePrefix & ACCOUNT_REGIONAL namespace
new s3.Bucket(stack, 'BucketWithNamePrefix', {
  bucketNamePrefix: 'example-bucket-namespace',
  bucketNamespace: s3.BucketNamespace.ACCOUNT_REGIONAL,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// correct suffix bucketName & ACCOUNT_REGIONAL namespace
new s3.Bucket(stack, 'BucketWithName_Regional', {
  bucketName: `example-bucket-name-${Aws.ACCOUNT_ID}-${Aws.REGION}-an`,
  bucketNamespace: s3.BucketNamespace.ACCOUNT_REGIONAL,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// bucketName & GLOBAL namespace
new s3.Bucket(stack, 'BucketWithName_Global', {
  bucketName: 'example-s3-bucket-name-global123',
  bucketNamespace: s3.BucketNamespace.GLOBAL,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 's3-namespaces-integ-test', {
  testCases: [stack],
});
