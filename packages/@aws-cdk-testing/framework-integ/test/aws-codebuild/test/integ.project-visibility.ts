#!/usr/bin/env node
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

class VisibilityTestStack extends Stack {
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
      visibility: codebuild.ProjectVisibility.PUBLIC_READ,
    });
  }
}

const visibilityTest = new VisibilityTestStack(app, 'codebuild-visibility');

new IntegTest(app, 'Visibility', {
  testCases: [visibilityTest],
  stackUpdateWorkflow: true,
});

