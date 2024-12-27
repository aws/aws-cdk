/// !cdk-integ canary-one
import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { ArtifactsEncryptionMode, Canary, Cleanup, Code, Runtime, Schedule, Test } from 'aws-cdk-lib/aws-synthetics';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'canary-artifact-s3-encryption');

const bucket = new s3.Bucket(stack, 'MyTestBucket', {
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const prefix = 'integ';

new Canary(stack, 'CanarySseS3Puppeteer', {
  test: Test.custom({
    handler: 'index.handler',
    code: Code.fromInline(`
      exports.handler = async () => {
        console.log(\'hello world\');
      };`),
  }),
  schedule: Schedule.rate(cdk.Duration.minutes(1)),
  artifactsBucketLocation: { bucket, prefix },
  runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
  cleanup: Cleanup.LAMBDA,
  artifactS3EncryptionMode: ArtifactsEncryptionMode.S3_MANAGED,
});

new Canary(stack, 'CanarySseS3PlayWright', {
  test: Test.custom({
    handler: 'canary.handler',
    code: Code.fromAsset(path.join(__dirname, 'canaries')),
  }),
  schedule: Schedule.rate(cdk.Duration.minutes(1)),
  artifactsBucketLocation: { bucket, prefix },
  runtime: Runtime.SYNTHETICS_NODEJS_PLAYWRIGHT_1_0,
  cleanup: Cleanup.LAMBDA,
  artifactS3EncryptionMode: ArtifactsEncryptionMode.S3_MANAGED,
});

new Canary(stack, 'CanarySseKmsWithoutKeySetting', {
  test: Test.custom({
    handler: 'index.handler',
    code: Code.fromInline(`
      exports.handler = async () => {
        console.log(\'hello world\');
      };`),
  }),
  schedule: Schedule.rate(cdk.Duration.minutes(1)),
  artifactsBucketLocation: { bucket, prefix },
  runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
  cleanup: Cleanup.LAMBDA,
  artifactS3EncryptionMode: ArtifactsEncryptionMode.KMS,
});

const encryptKey = new Key(stack, 'Key', { removalPolicy: RemovalPolicy.DESTROY });

new Canary(stack, 'CanarySseKmsWith', {
  test: Test.custom({
    handler: 'index.handler',
    code: Code.fromInline(`
      exports.handler = async () => {
        console.log(\'hello world\');
      };`),
  }),
  schedule: Schedule.rate(cdk.Duration.minutes(1)),
  artifactsBucketLocation: { bucket, prefix },
  runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
  cleanup: Cleanup.LAMBDA,
  artifactS3EncryptionMode: ArtifactsEncryptionMode.KMS,
  artifactS3KmsKey: encryptKey,
});

new IntegTest(app, 'IntegCanaryTest', {
  testCases: [stack],
});
