import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-s3-deploy');

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

const deployBucket = new s3.Bucket(stack, 'DeployBucket', {});

new codepipeline.Pipeline(stack, 'Pipeline', {
  stages: [
    {
      name: 'Source',
      actions: [sourceAction],
    },
    {
      name: 'Deploy',
      actions: [
        deployBucket.toCodePipelineDeployAction({
          actionName: 'DeployAction',
          inputArtifact: sourceAction.outputArtifact,
        }),
      ],
    },
  ],
});

app.run();
