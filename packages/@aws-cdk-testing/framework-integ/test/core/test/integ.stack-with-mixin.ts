import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'StackWithMixinTest');

new s3.CfnBucket(stack, 'Bucket', {
  bucketName: 'stack-with-mixin-test-bucket',
});

stack.with(
  new s3.mixins.BucketVersioning(),
  new s3.mixins.BucketBlockPublicAccess(),
);

new integ.IntegTest(app, 'StackWithMixinIntegTest', {
  testCases: [stack],
});

app.synth();
