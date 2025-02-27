import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { S3_BLOCK_PUBLIC_ACCESS_OPTION_AUTO_TRUE } from 'aws-cdk-lib/cx-api';

const app = new App({
  context: {
    [S3_BLOCK_PUBLIC_ACCESS_OPTION_AUTO_TRUE]: true,
  },
});

const stack = new Stack(app, 'aws-cdk-s3-bucket-block-access');

new Bucket(stack, 'blockAcls', {
  blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
});

new Bucket(stack, 'blockAll', {
  blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
});

// in the next 2 tests, because not all 4 options are blocked, those left undefined should default to true
new Bucket(stack, 'blockOnly2', {
  blockPublicAccess: {
    blockPublicAcls: false,
    blockPublicPolicy: false,
  },
});

new Bucket(stack, 'blockOnly1', {
  blockPublicAccess: {
    blockPublicPolicy: false,
  },
});

new IntegTest(app, 'testBlockingBucketAccess', {
  testCases: [stack],
});
