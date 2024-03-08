import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-type-v2');

const sourceBucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'Source',
  output: sourceOutput,
  bucket: sourceBucket,
  bucketKey: 'key',
});

const deployBucket = new s3.Bucket(stack, 'DeployBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: sourceBucket,
  pipelineType: codepipeline.PipelineType.V2,
  executionMode: codepipeline.ExecutionMode.PARALLEL,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Deploy',
      actions: [
        new cpactions.S3DeployAction({
          actionName: 'DeployAction',
          extract: false,
          objectKey: 'test.txt',
          input: sourceOutput,
          bucket: deployBucket,
        }),
      ],
    },
  ],
});

new IntegTest(app, 'codepipeline-type-v2-test', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
