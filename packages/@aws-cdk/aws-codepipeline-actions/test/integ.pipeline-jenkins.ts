import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cpactions = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-jenkins');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  versioned: true,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
});

const sourceAction = new cpactions.S3SourceAction({
  actionName: 'S3',
  bucketKey: 'some/path',
  bucket,
});
pipeline.addStage({
  name: 'Source',
  actions: [sourceAction],
});

const jenkinsProvider = new cpactions.JenkinsProvider(stack, 'JenkinsProvider', {
  providerName: 'JenkinsProvider',
  serverUrl: 'http://myjenkins.com:8080',
  version: '2',
});

pipeline.addStage({
  name: 'Build',
  actions: [
    new cpactions.JenkinsBuildAction({
      actionName: 'JenkinsBuild',
      jenkinsProvider,
      projectName: 'JenkinsProject1',
      inputArtifact: sourceAction.outputArtifact,
    }),
    new cpactions.JenkinsTestAction({
      actionName: 'JenkinsTest',
      jenkinsProvider,
      projectName: 'JenkinsProject2',
      inputArtifact: sourceAction.outputArtifact,
    }),
    new cpactions.JenkinsTestAction({
      actionName: 'JenkinsTest2',
      jenkinsProvider,
      projectName: 'JenkinsProject3',
      inputArtifact: sourceAction.outputArtifact,
    }),
  ],
});

app.run();
