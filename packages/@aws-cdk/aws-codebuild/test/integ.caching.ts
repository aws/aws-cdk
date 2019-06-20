#!/usr/bin/env node
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codebuild = require('../lib');
import { Cache } from '../lib/cache';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild');

const bucket = new s3.Bucket(stack, 'CacheBucket', {
  removalPolicy: cdk.RemovalPolicy.Destroy
});

new codebuild.Project(stack, 'MyProject', {
  cache: Cache.bucket(bucket),
  buildSpec: codebuild.BuildSpec.fromObject({
    build: {
      commands: ['echo Hello']
    },
    cache: {
      paths: ['/root/.cache/pip/**/*']
    }
  })
});

app.synth();
