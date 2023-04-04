import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-secondary-sources-artifacts');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new codebuild.Project(stack, 'MyProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
  }),
  secondarySources: [
    codebuild.Source.s3({
      bucket,
      path: 'some/path',
      identifier: 'AddSource1',
    }),
  ],
  secondaryArtifacts: [
    codebuild.Artifacts.s3({
      bucket,
      path: 'another/path',
      name: 'name',
      identifier: 'AddArtifact1',
    }),
  ],
  grantReportGroupPermissions: false,
});

app.synth();
