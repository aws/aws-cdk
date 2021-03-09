import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as codebuild from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-logging');

new codebuild.PipelineProject(stack, 'Project', {
  logging: {
    cloudWatch: {
      logGroup: new logs.LogGroup(stack, 'LogingGroup', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }),
    },
    s3: {
      bucket: new s3.Bucket(stack, 'LoggingBucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }),
    },
  },
});

app.synth();
