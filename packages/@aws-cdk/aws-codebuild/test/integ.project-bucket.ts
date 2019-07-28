#!/usr/bin/env node
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import codebuild = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY
});

new codebuild.Project(stack, 'MyProject', {
  source: codebuild.Source.s3({
    bucket,
    path: 'path/to/my/source.zip',
  }),
  environment: {
    computeType: codebuild.ComputeType.LARGE
  }
});

app.synth();
