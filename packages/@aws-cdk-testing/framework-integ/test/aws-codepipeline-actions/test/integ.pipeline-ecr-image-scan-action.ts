import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import * as path from 'path';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'codepipeline-ecr-image-scan-action');

const bucket = new s3.Bucket(stack, 'SourceBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  versioned: true,
});

// To start the pipeline
const bucketDeployment = new BucketDeployment(stack, 'BucketDeployment', {
  sources: [Source.asset(path.join(__dirname, 'assets', 'nodejs.zip'))],
  destinationBucket: bucket,
  extract: false,
});
const zipKey = cdk.Fn.select(0, bucketDeployment.objectKeys);

const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'Source',
  output: sourceOutput,
  bucket,
  bucketKey: zipKey,
});

const image = new DockerImageAsset(stack, 'DockerImage', {
  directory: path.resolve(__dirname, './assets'),
});

const scanOutput = new codepipeline.Artifact();
const scanAction = new cpactions.InspectorEcrImageScanAction({
  actionName: 'InspectorEcrImageScanAction',
  output: scanOutput,
  repository: image.repository,
  imageTag: image.imageTag,
  criticalThreshold: 5,
  highThreshold: 5,
  mediumThreshold: 5,
  lowThreshold: 5,
});

const deployBucket = new s3.Bucket(stack, 'DeployBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const deployAction = new cpactions.S3DeployAction({
  actionName: 'DeployAction',
  input: scanOutput,
  bucket: deployBucket,
  objectKey: 'my-key',
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Invoke',
      actions: [scanAction],
    },
    {
      stageName: 'Deploy',
      actions: [deployAction],
    },
  ],
});

const integ = new IntegTest(app, 'codepipeline-ecr-image-scan-action-test', {
  testCases: [stack],
  diffAssets: true,
});

const startPipelineCall = integ.assertions.awsApiCall('CodePipeline', 'startPipelineExecution', {
  name: pipeline.pipelineName,
});

startPipelineCall.next(
  integ.assertions.awsApiCall('CodePipeline', 'getPipelineState', {
    name: pipeline.pipelineName,
  }).expect(ExpectedResult.objectLike({
    stageStates: Match.arrayWith([
      Match.objectLike({
        stageName: 'Invoke',
        latestExecution: Match.objectLike({
          status: 'Succeeded',
        }),
      }),
    ]),
  })).waitForAssertions({
    totalTimeout: cdk.Duration.minutes(5),
  }),
);
