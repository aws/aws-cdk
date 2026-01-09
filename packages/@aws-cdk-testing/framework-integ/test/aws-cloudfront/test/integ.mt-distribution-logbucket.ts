import * as cdk from 'aws-cdk-lib';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-mt-distribution-logbucket');

const logBucket = new cdk.aws_s3.Bucket(stack, 'LogBucket', {
  objectOwnership: cdk.aws_s3.ObjectOwnership.OBJECT_WRITER,
});

new cloudfront.MTDistribution(stack, 'MyDist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
  },
  logBucket,
});

new integ.IntegTest(app, 'LambdaTest', {
  testCases: [stack],
});

app.synth();
