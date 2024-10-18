import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { Key } from 'aws-cdk-lib/aws-kms';
import * as path from 'path';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-commands');

const key = new Key(stack, 'EnvVarEncryptKey', {
  description: 'sample key',
});

const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  versioned: true,
  encryptionKey: key,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'Source',
  output: sourceOutput,
  bucket,
  bucketKey: 'assets/nodejs.zip',
});

const commandsOutput = new codepipeline.Artifact('CommandsArtifact', ['my-dir/**/*']);
const commandsAction = new cpactions.CommandsAction({
  actionName: 'Commands',
  commands: [
    'pwd',
    'ls -la',
    'mkdir -p my-dir',
    'echo "HelloWorld" > my-dir/file.txt',
    'export MY_OUTPUT=my-key',
    'touch ignored.txt',
  ],
  input: sourceOutput,
  output: commandsOutput,
  outputVariables: ['MY_OUTPUT', 'CODEBUILD_BUILD_ID', 'AWS_DEFAULT_REGION'],
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
  objectKey: commandsAction.variable('MY_OUTPUT'),
  encryptionKey: key,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
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

const integ = new IntegTest(app, 'aws-cdk-codepipeline-commands-test', {
  testCases: [stack],
  diffAssets: true,
});

const putObjectCall = integ.assertions.awsApiCall('S3', 'putObject', {
  Bucket: bucket.bucketName,
  Key: 'assets/nodejs.zip',
  Body: path.join(__dirname, 'assets', 'nodejs.zip'),
});

putObjectCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['kms:GenerateDataKey'],
  Resource: ['*'],
});

const getObjectCall = integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: deployBucket.bucketName,
  Key: 'my-key/my-dir/file.txt',
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
