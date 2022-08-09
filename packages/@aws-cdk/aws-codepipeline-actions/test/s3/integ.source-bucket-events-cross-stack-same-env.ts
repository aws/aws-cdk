/// !cdk-integ PipelineStack

import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as cpactions from '../../lib';

const app = new App();
const bucketStack = new Stack(app, 'BucketStack');
const bucket = new s3.Bucket(bucketStack, 'Bucket', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const pipelineStack = new Stack(app, 'PipelineStack');
const sourceOutput = new codepipeline.Artifact();
new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
  stages: [
    {
      stageName: 'Source',
      actions: [
        new cpactions.S3SourceAction({
          actionName: 'Source',
          bucket,
          trigger: cpactions.S3Trigger.EVENTS,
          bucketKey: 'file.zip',
          output: sourceOutput,
        }),
      ],
    },
    {
      stageName: 'Build',
      actions: [
        new cpactions.CodeBuildAction({
          actionName: 'Build',
          project: new codebuild.PipelineProject(pipelineStack, 'Project'),
          input: sourceOutput,
        }),
      ],
    },
  ],
});

new integ.IntegTest(app, 'CodePipelineS3SourceTest', {
  testCases: [pipelineStack],
});
