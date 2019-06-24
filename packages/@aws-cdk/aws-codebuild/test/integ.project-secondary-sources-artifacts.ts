import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import codebuild = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-secondary-sources-artifacts');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY
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
});

app.synth();
