import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new cdk.App({
  treeMetadata: false,
  postCliContext: {
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-with-pipeline-variables');

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

const variable = new codepipeline.Variable({
  variableName: 'bucket-var',
  description: 'description',
  defaultValue: 'sample',
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: sourceBucket,
  pipelineType: codepipeline.PipelineType.V2,
  variables: [variable],
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
          objectKey: `${variable.reference()}.txt`,
          input: sourceOutput,
          bucket: deployBucket,
        }),
      ],
    },
  ],
});

const integ = new IntegTest(app, 'codepipeline-with-pipeline-variables-test', {
  testCases: [stack],
  diffAssets: true,
});

const getObjectCall = integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: deployBucket.bucketName,
  Key: 'sample.txt',
});

const putObjectCall = integ.assertions.awsApiCall('S3', 'putObject', {
  Bucket: sourceBucket.bucketName,
  Key: 'key',
  Body: 'HelloWorld',
});

putObjectCall.next(
  integ.assertions.awsApiCall('CodePipeline', 'getPipelineState', {
    name: pipeline.pipelineName,
  }).expect(ExpectedResult.objectLike({
    stageStates: Match.arrayWith([
      Match.objectLike({
        stageName: 'Deploy',
        latestExecution: Match.objectLike({
          status: 'Succeeded',
        }),
      }),
    ]),
  })).waitForAssertions({
    totalTimeout: Duration.minutes(5),
  }).next(getObjectCall),
);

app.synth();
