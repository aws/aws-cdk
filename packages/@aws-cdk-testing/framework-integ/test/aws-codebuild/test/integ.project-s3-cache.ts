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

const project = new codebuild.Project(stack, 'Project', {
  source: codebuild.Source.s3({
    bucket,
    path: 'path/to/my/source.zip',
  }),
  cache: codebuild.Cache.bucket(bucket, {
    prefix: 'cache',
    cacheNamespace: 'cache-namespace',
  }),
});

const integ = new IntegTest(app, 'codebuild-s3-cache-integ', {
  testCases: [stack],
});

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
