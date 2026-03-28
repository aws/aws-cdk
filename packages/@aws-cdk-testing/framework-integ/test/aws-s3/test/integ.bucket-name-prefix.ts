import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-s3-bucket-name-prefix');

new s3.Bucket(stack, 'BucketWithNamePrefix', {
  bucketNamePrefix: 'my-app',
  bucketNamespace: s3.BucketNamespace.ACCOUNT_REGIONAL,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'aws-cdk-s3-bucket-name-prefix-integ', {
  testCases: [stack],
});

