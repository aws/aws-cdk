import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';

import * as cloudtrail from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-cdk-cloudtrail-inshights-test');

const cloudTrailPrincipal = new iam.ServicePrincipal('cloudtrail.amazonaws.com');

const Trailbucket = new s3.Bucket(stack, 'S3', {
  encryption: s3.BucketEncryption.UNENCRYPTED,
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

Trailbucket.addToResourcePolicy(new iam.PolicyStatement({
  resources: [Trailbucket.bucketArn],
  actions: ['s3:GetBucketAcl'],
  principals: [cloudTrailPrincipal],
}));

Trailbucket.addToResourcePolicy(new iam.PolicyStatement({
  resources: [Trailbucket.arnForObjects(`AWSLogs/${Stack.of(stack).account}/*`)],
  actions: ['s3:PutObject'],
  principals: [cloudTrailPrincipal],
  conditions: {
    StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
  },
}));

new cloudtrail.Trail(stack, 'Trail', {
  bucket: Trailbucket,
  insightTypes: [
    cloudtrail.InsightType.API_CALL_RATE,
    cloudtrail.InsightType.API_ERROR_RATE,
  ],
});


new integ.IntegTest(app, 'aws-cdk-cloudtrail-inshights', {
  testCases: [stack],
});

app.synth();
