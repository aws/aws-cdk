import * as cdk from 'aws-cdk-lib';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { CODEPIPELINE_DEFAULT_PIPELINE_TYPE_TO_V2 } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  treeMetadata: false,
  postCliContext: {
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-pipeline-type-v2-by-default');
stack.node.setContext(CODEPIPELINE_DEFAULT_PIPELINE_TYPE_TO_V2, true);

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
  // pipelineType: codepipeline.PipelineType.V2, // V2 is set by default when the feature flag is enabled
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

new IntegTest(app, 'codepipeline-pipeline-type-v2-by-default-test', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
