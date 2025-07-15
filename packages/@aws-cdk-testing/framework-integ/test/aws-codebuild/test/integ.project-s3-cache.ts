#!/usr/bin/env node
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'codebuild-s3-cache-stack');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const buildSpec = codebuild.BuildSpec.fromObject({
  version: '0.2',
  phases: {
    build: {
      commands: ['echo "Hello, CodeBuild!"'],
    },
  },
  cache: {
    paths: [
      '/root/cachedir/**/*',
    ],
    key: 'unique-key',
  },
});

const projectA = new codebuild.Project(stack, 'ProjectA', {
  source: codebuild.Source.s3({
    bucket,
    path: 'path/to/source-a.zip',
  }),
  cache: codebuild.Cache.bucket(bucket, {
    prefix: 'cache',
    cacheNamespace: 'cache-namespace',
  }),
  buildSpec,
});

const projectB = new codebuild.Project(stack, 'ProjectB', {
  source: codebuild.Source.s3({
    bucket,
    path: 'path/to/source-b.zip',
  }),
  cache: codebuild.Cache.bucket(bucket, {
    prefix: 'cache',
    cacheNamespace: 'cache-namespace',
  }),
  buildSpec,
});

const integ = new IntegTest(app, 'codebuild-s3-cache-integ', {
  testCases: [stack],
});

[projectA, projectB].forEach((project) => {
  integ.assertions.awsApiCall('CodeBuild', 'batchGetProjects', {
    names: [project.projectName],
  }).expect(ExpectedResult.objectLike({
    projects: [{
      cache: {
        type: 'S3',
        location: `${bucket.bucketName}/cache`,
        cacheNamespace: 'cache-namespace',
      },
    }],
  }));
});
