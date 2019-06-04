import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codebuild = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-secondary-sources-artifacts');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.Destroy
});

new codebuild.Project(stack, 'MyProject', {
  buildSpec: {
    version: '0.2',
  },
  secondarySources: [
    new codebuild.S3BucketSource({
      bucket,
      path: 'some/path',
      identifier: 'AddSource1',
    }),
  ],
  secondaryArtifacts: [
    new codebuild.S3BucketBuildArtifacts({
      bucket,
      path: 'another/path',
      name: 'name',
      identifier: 'AddArtifact1',
    }),
  ],
});

app.synth();
