import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as cloudtrail from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudtrail');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const topic = new sns.Topic(stack, 'Topic');
const lambdaFunction = new lambda.Function(stack, 'LambdaFunction', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'hello.handler',
  code: lambda.Code.fromInline('exports.handler = {}'),
});

const trail = new cloudtrail.Trail(stack, 'Trail', {
  snsTopic: topic,
});
trail.addLambdaEventSelector([lambdaFunction]);
trail.addS3EventSelector([{ bucket }]);

app.synth();
