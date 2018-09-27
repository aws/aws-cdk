#!/usr/bin/env node
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codebuild = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-codebuild');

const bucket = new s3.Bucket(stack, 'MyBucket');

new codebuild.Project(stack, 'MyProject', {
  source: new codebuild.S3BucketSource(bucket, 'path/to/my/source.zip'),
  environment: {
    computeType: codebuild.ComputeType.Large
  }
});

process.stdout.write(app.run());
