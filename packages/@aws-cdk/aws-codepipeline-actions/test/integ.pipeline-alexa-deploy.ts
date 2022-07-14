import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import { App, RemovalPolicy, SecretValue, Stack } from '@aws-cdk/core';
import * as cpactions from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-codepipeline-alexa-deploy');

const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: RemovalPolicy.DESTROY,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'Source',
  output: sourceOutput,
  bucket,
  bucketKey: 'key',
});
const sourceStage = {
  stageName: 'Source',
  actions: [sourceAction],
};

const deployStage = {
  stageName: 'Deploy',
  actions: [
    new cpactions.AlexaSkillDeployAction({
      actionName: 'DeploySkill',
      runOrder: 1,
      input: sourceOutput,
      clientId: 'clientId',
      clientSecret: SecretValue.unsafePlainText('clientSecret'),
      refreshToken: SecretValue.unsafePlainText('refreshToken'),
      skillId: 'amzn1.ask.skill.12345678-1234-1234-1234-123456789012',
    }),
  ],
};

new codepipeline.Pipeline(stack, 'Pipeline', {
  stages: [
    sourceStage,
    deployStage,
  ],
});

app.synth();
