import alexa = require('@aws-cdk/alexa-ask');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-alexa-deploy');

const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.Destroy,
});
const sourceAction = new s3.PipelineSourceAction({
  actionName: 'Source',
  outputArtifactName: 'SourceArtifact',
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
    new alexa.AlexaSkillDeployAction({
      actionName: 'DeploySkill',
      runOrder: 1,
      inputArtifact: sourceAction.outputArtifact,
      clientId: new cdk.Secret('clientId'),
      clientSecret: new cdk.Secret('clientSecret'),
      refreshToken: new cdk.Secret('refreshToken'),
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
