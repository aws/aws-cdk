import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-jenkins');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  versioned: true,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
});

const sourceOutput = new codepipeline.Artifact();
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'S3',
  bucketKey: 'some/path',
  bucket,
  output: sourceOutput,
});
pipeline.addStage({
  stageName: 'Source',
  actions: [sourceAction],
});

const jenkinsProvider = new cpactions.JenkinsProvider(stack, 'JenkinsProvider', {
  providerName: 'JenkinsProvider',
  serverUrl: 'http://myjenkins.com:8080',
  version: '2',
});

pipeline.addStage({
  stageName: 'Build',
  actions: [
    new cpactions.JenkinsAction({
      actionName: 'JenkinsBuild',
      jenkinsProvider,
      type: cpactions.JenkinsActionType.BUILD,
      projectName: 'JenkinsProject1',
      inputs: [sourceOutput],
      outputs: [new codepipeline.Artifact()],
    }),
    new cpactions.JenkinsAction({
      actionName: 'JenkinsTest',
      jenkinsProvider,
      type: cpactions.JenkinsActionType.TEST,
      projectName: 'JenkinsProject2',
      inputs: [sourceOutput],
    }),
    new cpactions.JenkinsAction({
      actionName: 'JenkinsTest2',
      jenkinsProvider,
      type: cpactions.JenkinsActionType.TEST,
      projectName: 'JenkinsProject3',
      inputs: [sourceOutput],
    }),
  ],
});

app.synth();
