import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as cpactions from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-codepipeline-elastic-beanstalk-deploy');

const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: RemovalPolicy.DESTROY,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
});

const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'Source',
  output: sourceOutput,
  bucket,
  bucketKey: 'key',
});

pipeline.addStage({
  stageName: 'Source',
  actions: [
    sourceAction,
  ],
});


const deployAction = new cpactions.ElasticBeanstalkDeployAction({
  actionName: 'Deploy',
  input: sourceOutput,
  environmentName: 'envName',
  applicationName: 'appName',
});

pipeline.addStage({
  stageName: 'Deploy',
  actions: [
    deployAction,
  ],
});

new integ.IntegTest(app, 'codepipeline-elastic-beanstalk-deploy', {
  testCases: [stack],
});

app.synth();