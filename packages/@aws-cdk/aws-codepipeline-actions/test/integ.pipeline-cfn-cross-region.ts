import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import cpactions = require('../lib');

const app = new cdk.App();

const region = 'us-west-2'; // hardcode the region
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation-cross-region', {
  env: {
    region,
  },
});

const bucket = new s3.Bucket(stack, 'MyBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const sourceOutput = new codepipeline.Artifact();
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'S3',
  bucketKey: 'some/path',
  bucket,
  output: sourceOutput,
});

new codepipeline.Pipeline(stack, 'MyPipeline', {
  artifactBucket: bucket,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'CFN',
      actions: [
        new cpactions.CloudFormationCreateUpdateStackAction({
          actionName: 'CFN_Deploy',
          stackName: 'aws-cdk-codepipeline-cross-region-deploy-stack',
          templatePath: sourceOutput.atPath('template.yml'),
          adminPermissions: false,
          region,
        }),
      ],
    },
  ],
});

app.synth();
