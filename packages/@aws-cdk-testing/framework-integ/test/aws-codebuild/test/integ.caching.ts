#!/usr/bin/env node
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { Cache } from 'aws-cdk-lib/aws-codebuild';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild');

const bucket = new s3.Bucket(stack, 'CacheBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new codebuild.Project(stack, 'MyProject', {
  cache: Cache.bucket(bucket),
  buildSpec: codebuild.BuildSpec.fromObject({
    build: {
      commands: ['echo Hello'],
    },
    cache: {
      paths: ['/root/.cache/pip/**/*'],
    },
  }),
  grantReportGroupPermissions: false,
});

app.synth();
