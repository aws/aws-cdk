import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import { App, RemovalPolicy, SecretValue, Stack } from '@aws-cdk/cdk';
import cpactions = require('../lib');

const app = new App();

const stack = new Stack(app, 'aws-cdk-codepipeline-alexa-deploy');

const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: RemovalPolicy.Destroy,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'Source',
  output: sourceOutput,
  bucket,
  bucketKey: 'key',
});
const sourceStage = {
  name: 'Source',
  actions: [sourceAction],
};

const deployStage = {
  name: 'Deploy',
  actions: [
    new cpactions.AlexaSkillDeployAction({
      actionName: 'DeploySkill',
      runOrder: 1,
      input: sourceOutput,
      clientId: 'clientId',
      clientSecret: SecretValue.plainText('clientSecret'),
      refreshToken: SecretValue.plainText('refreshToken'),
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

app.run();
