#!/usr/bin/env node
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codebuild = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-codebuild');

const bucket = new s3.Bucket(stack, 'CacheBucket');

new codebuild.Project(stack, 'MyProject', {
  cacheBucket: bucket,
  buildSpec: {
    build: {
      commands: ['echo Hello']
    },
    cache: {
      paths: ['/root/.cache/pip/**/*']
    }
  }
});

process.stdout.write(app.run());
