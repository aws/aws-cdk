/// !cdk-integ PipelineStack

import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});
const bucketStack = new Stack(app, 'BucketStack');
const bucket = new s3.Bucket(bucketStack, 'Bucket', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const pipelineStack = new Stack(app, 'PipelineStack');
const sourceOutput = new codepipeline.Artifact();
new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
  crossAccountKeys: true,
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
