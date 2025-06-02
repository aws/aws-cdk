import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';

import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'integ-cloudtrail');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const lambdaFunction = new lambda.Function(stack, 'LambdaFunction', {
  runtime: STANDARD_NODEJS_RUNTIME,
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
