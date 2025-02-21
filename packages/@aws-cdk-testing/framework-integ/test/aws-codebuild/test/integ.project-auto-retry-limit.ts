#!/usr/bin/env node
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

class AutoRetryLimitStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    new codebuild.Project(this, 'MyProject', {
      source: codebuild.Source.s3({
        bucket,
        path: 'path/to/my/source.zip',
      }),
      autoRetryLimit: 2,
    });
  }
}

const autoRetryLimitTest = new AutoRetryLimitStack(app, 'codebuild-auto-retry-limit');

new IntegTest(app, 'AutoRetryLimit', {
  testCases: [autoRetryLimitTest],
  stackUpdateWorkflow: true,
});
