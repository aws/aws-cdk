import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';

import * as cloudtrail from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudtrail');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const lambdaFunction = new lambda.Function(stack, 'LambdaFunction', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'hello.handler',
  code: lambda.Code.fromInline('exports.handler = {}'),
});

// using exctecy the same code as inside the cloudtrail class to produce the supplied bucket and policy
const cloudTrailPrincipal = new iam.ServicePrincipal('cloudtrail.amazonaws.com');

const Trailbucket = new s3.Bucket(stack, 'S3', {
  encryption: s3.BucketEncryption.UNENCRYPTED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

Trailbucket.addToResourcePolicy(new iam.PolicyStatement({
  resources: [Trailbucket.bucketArn],
  actions: ['s3:GetBucketAcl'],
  principals: [cloudTrailPrincipal],
}));

Trailbucket.addToResourcePolicy(new iam.PolicyStatement({
  resources: [Trailbucket.arnForObjects(`AWSLogs/${cdk.Stack.of(stack).account}/*`)],
  actions: ['s3:PutObject'],
  principals: [cloudTrailPrincipal],
  conditions: {
    StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
  },
}));

const trail = new cloudtrail.Trail(stack, 'Trail', { bucket: Trailbucket });

trail.addLambdaEventSelector([lambdaFunction]);
trail.addS3EventSelector([{ bucket }]);

app.synth();
