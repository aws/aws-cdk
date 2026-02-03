import { PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { Pipeline, Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { S3SourceAction, CodeBuildAction } from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new App({
  treeMetadata: false,
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});
const stack1 = new Stack(app, 'integ-pipeline-producer-stack', {
  env: {
    region: 'us-east-1',
  },
  crossRegionReferences: true,
});
const stack2 = new Stack(app, 'integ-pipeline-consumer-stack', {
  env: {
    region: 'us-east-2',
  },
  crossRegionReferences: true,
});

const key = new Key(stack1, 'ReplicationKey');
const bucket = new Bucket(stack1, 'ReplicationBucket', {
  encryptionKey: key,
  autoDeleteObjects: true,
  removalPolicy: RemovalPolicy.DESTROY,
});

const artifact = new Artifact();
const pipeline = new Pipeline(stack2, 'Pipeline', {
  crossAccountKeys: true,
  crossRegionReplicationBuckets: {
    'us-east-1': bucket,
  },
});
const sourceBucket = new Bucket(stack2, 'SourceBucket', {
  autoDeleteObjects: true,
  removalPolicy: RemovalPolicy.DESTROY,
});
pipeline.addStage({
  stageName: 'source',
  actions: [new S3SourceAction({
    bucket: sourceBucket,
    output: artifact,
    bucketKey: '/somepath',
    actionName: 'Source',
  })],
});
pipeline.addStage({
  stageName: 'stage2',
  actions: [new CodeBuildAction({
    input: artifact,
    actionName: 'Build',
    project: new PipelineProject(stack2, 'Build'),
  })],
});

new IntegTest(app, 'codepipeline-integ-test', {
  testCases: [stack2],
  stackUpdateWorkflow: false,
});
