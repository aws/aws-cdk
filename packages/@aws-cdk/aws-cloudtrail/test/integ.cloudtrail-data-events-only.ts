import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as cloudtrail from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudtrail-data-events');

const bucket = new s3.Bucket(stack, 'Bucket', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const lambdaFunction = new lambda.Function(stack, 'LambdaFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'hello.handler',
  code: lambda.Code.fromInline('exports.handler = {}'),
});

const trail = new cloudtrail.Trail(stack, 'Trail', {
  managementEvents: cloudtrail.ReadWriteType.NONE,
});
trail.addLambdaEventSelector([lambdaFunction]);
trail.addS3EventSelector([{ bucket }]);

new integ.IntegTest(app, 'CloudTrailDataEventsOnlyTest', {
  testCases: [stack],
});

app.synth();