import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as path from 'path';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-environment-variables');

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

const commandsOutput = new codepipeline.Artifact('CommandsArtifact', ['my-dir/**/*']);

const secret = new Secret(stack, 'Secret', {
  secretStringValue: cdk.SecretValue.unsafePlainText('This is the content stored in secrets manager'),
});
const secretEnvVar = codepipeline.EnvironmentVariable.fromSecretsManager({
  name: 'MY_SECRET',
  secret: secret,
});

const plaintextValue = 'my-plaintext';
const plaintextEnvVar = codepipeline.EnvironmentVariable.fromPlaintext({
  name: 'MY_PLAINTEXT',
  value: plaintextValue,
});

const commandsAction = new cpactions.CommandsAction({
  actionName: 'Commands',
  commands: [
    `echo "MY_SECRET:$${secretEnvVar.name}"`,
    `echo "MY_PLAINTEXT:$${plaintextEnvVar.name}"`,
    'mkdir -p my-dir',
    'echo "HelloWorld" > my-dir/file.txt',
  ],
  input: sourceOutput,
  output: commandsOutput,
  outputVariables: [plaintextEnvVar.name],
  actionEnvironmentVariables: [
    secretEnvVar,
    plaintextEnvVar,
  ],
});

const deployBucket = new s3.Bucket(stack, 'DeployBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const deployAction = new cpactions.S3DeployAction({
  actionName: 'DeployAction',
  extract: true,
  input: commandsOutput,
  bucket: deployBucket,
  objectKey: commandsAction.variable(plaintextEnvVar.name),
});

const pipelineBucket = new s3.Bucket(stack, 'PipelineBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: pipelineBucket,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Compute',
      actions: [commandsAction],
    },
    {
      stageName: 'Deploy',
      actions: [deployAction],
    },
  ],
});

const integ = new IntegTest(app, 'aws-cdk-codepipeline-environment-variables-test', {
  testCases: [stack],
  diffAssets: true,
});

const startPipelineCall = integ.assertions.awsApiCall('CodePipeline', 'startPipelineExecution', {
  name: pipeline.pipelineName,
});

const getObjectCall = integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: deployBucket.bucketName,
  Key: `${plaintextValue}/my-dir/file.txt`,
});

startPipelineCall.next(
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
