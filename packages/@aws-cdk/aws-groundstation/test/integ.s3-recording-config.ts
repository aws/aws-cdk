import { Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';
import { App, Fn, RemovalPolicy, Stack } from '@aws-cdk/core';
import { S3RecordingConfig } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-groundstation-configs');

const bucket = new Bucket(stack, 'Bucket', {
  bucketName: `aws-groundstation-${stack.stackName}-${stack.account}`,
  autoDeleteObjects: true,
  removalPolicy: RemovalPolicy.DESTROY,
});

const role = new Role(stack, 'Role', {
  assumedBy: new ServicePrincipal('groundstation.amazonaws.com'),
  inlinePolicies: {
    bucketAccess: new PolicyDocument({
      statements: [
        new PolicyStatement({
          actions: ['s3:GetBucketLocation'],
          resources: [bucket.bucketArn],
          effect: Effect.ALLOW,
        }),
        new PolicyStatement({
          actions: ['s3:PutObject'],
          resources: [Fn.join('/', [bucket.bucketArn, '*'])],
          effect: Effect.ALLOW,
        }),
      ],
    }),
  },
});

new S3RecordingConfig(stack, 'S3RecordingConfig_1', {
  configName: 'S3RecordingConfig_1',
  bucket,
  role,
  prefix: '{satellite_id}/{year}/{month}/{day}/',
});

app.synth();