import { PipelineProject } from '@aws-cdk/aws-codebuild';
import { Pipeline, Artifact } from '@aws-cdk/aws-codepipeline';
import { Key } from '@aws-cdk/aws-kms';
import { Bucket } from '@aws-cdk/aws-s3';
import { App, Stack, RemovalPolicy } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { S3SourceAction, CodeBuildAction } from '../lib';


const app = new App({
  treeMetadata: false,
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
