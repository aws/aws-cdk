import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';

const app = new App();
const stack = new Stack(app, 'aws-cdk-cloudtrail-inshights-test');

const cloudTrailPrincipal = new iam.ServicePrincipal('cloudtrail.amazonaws.com');

const Trailbucket = new s3.Bucket(stack, 'S3', {
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
