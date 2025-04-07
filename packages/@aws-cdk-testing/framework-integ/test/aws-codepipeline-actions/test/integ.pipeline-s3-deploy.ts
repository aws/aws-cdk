import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-s3-deploy');

const key: kms.IKey = new kms.Key(stack, 'EnvVarEncryptKey', {
  description: 'sample key',
});

const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  encryptionKey: key,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'Source',
  output: sourceOutput,
  bucket,
  bucketKey: 'key',
});

const deployBucket = new s3.Bucket(stack, 'DeployBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const otherDeployBucket = new s3.Bucket(stack, 'OtherDeployBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
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
          objectKey: 'key',
          input: sourceOutput,
          bucket: deployBucket,
          accessControl: s3.BucketAccessControl.PRIVATE,
          cacheControl: [
            cpactions.CacheControl.setPublic(),
            cpactions.CacheControl.maxAge(cdk.Duration.hours(12)),
          ],
          encryptionKey: key,
        }),
      ],
    },
    {
      stageName: 'Disabled',
      transitionToEnabled: false,
      actions: [
        new cpactions.S3DeployAction({
          actionName: 'DisabledDeployAction',
          input: sourceOutput,
          bucket: otherDeployBucket,
        }),
      ],
    },
  ],
});

const integ = new IntegTest(app, 's3-deploy-test', {
  testCases: [stack],
  diffAssets: true,
});

const getObjectCall = integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: deployBucket.bucketName,
  Key: 'key',
});

getObjectCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['kms:Decrypt'],
  Resource: ['*'],
});

const putObjectCall = integ.assertions.awsApiCall('S3', 'putObject', {
  Bucket: bucket.bucketName,
  Key: 'key',
  Body: 'HelloWorld',
});

putObjectCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['kms:GenerateDataKey'],
  Resource: ['*'],
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
