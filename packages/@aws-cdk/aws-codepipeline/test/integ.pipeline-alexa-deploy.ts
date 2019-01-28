import alexa = require('@aws-cdk/alexa-ask');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { Secret } from '@aws-cdk/cdk';
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-alexa-deploy');

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const sourceStage = new codepipeline.Stage(pipeline, 'Source', { pipeline });
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.Destroy,
});
const sourceAction = new s3.PipelineSourceAction(stack, 'Source', {
  stage: sourceStage,
  outputArtifactName: 'SourceArtifact',
  bucket,
  bucketKey: 'key',
});

const deployStage = new codepipeline.Stage(pipeline, 'Deploy', { pipeline });

new alexa.AlexaSkillDeployAction(stack, 'DeploySkill', {
  stage: deployStage,
  runOrder: 1,
  inputArtifact: sourceAction.outputArtifact,
  clientId: new Secret('clientId'),
  clientSecret: new Secret('clientSecret'),
  refreshToken: new Secret('refreshToken'),
  skillId: 'amzn1.ask.skill.12345678-1234-1234-1234-123456789012',
});

app.run();
