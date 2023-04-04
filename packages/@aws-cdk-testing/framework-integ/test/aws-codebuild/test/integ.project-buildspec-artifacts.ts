import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-buildspec-artifact-name');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new codebuild.Project(stack, 'MyProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
  }),
  grantReportGroupPermissions: false,
  artifacts:
    codebuild.Artifacts.s3({
      bucket,
      includeBuildId: false,
      packageZip: true,
      path: 'another/path',
      identifier: 'AddArtifact1',
    }),
});

app.synth();
