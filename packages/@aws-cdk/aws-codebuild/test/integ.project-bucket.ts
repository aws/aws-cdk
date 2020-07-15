#!/usr/bin/env node
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as codebuild from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new codebuild.Project(stack, 'MyProject', {
  source: codebuild.Source.s3({
    bucket,
    path: 'path/to/my/source.zip',
  }),
  environment: {
    computeType: codebuild.ComputeType.LARGE,
  },
  grantReportGroupPermissions: false,
});

app.synth();
