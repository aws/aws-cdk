import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cpactions from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation-cross-region-with-action-role', {});

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
const sourceStage = {
  stageName: 'Source',
  actions: [sourceAction],
};

const role = new iam.Role(stack, 'ActionRole', {
  assumedBy: new iam.AccountPrincipal(cdk.Aws.ACCOUNT_ID),
});
role.addToPolicy(new iam.PolicyStatement({
  actions: ['sqs:*'],
  resources: ['*'],
}));
const cfnStage = {
  stageName: 'CFN',
  actions: [
    new cpactions.CloudFormationCreateUpdateStackAction({
      actionName: 'CFN_Deploy',
      stackName: 'aws-cdk-codepipeline-cross-region-deploy-stack',
      templatePath: sourceOutput.atPath('template.yml'),
      adminPermissions: false,
      role,
    }),
  ],
};

new codepipeline.Pipeline(stack, 'MyPipeline', {
  artifactBucket: bucket,
  stages: [
    sourceStage,
    cfnStage,
  ],
});

app.synth();
