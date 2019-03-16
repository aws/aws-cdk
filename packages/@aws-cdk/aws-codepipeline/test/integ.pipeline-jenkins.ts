import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-jenkins');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  versioned: true,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
});

const sourceAction = bucket.toCodePipelineSourceAction({
  actionName: 'S3',
  bucketKey: 'some/path',
});
pipeline.addStage({
  name: 'Source',
  actions: [sourceAction],
});

const jenkinsProvider = new codepipeline.JenkinsProvider(stack, 'JenkinsProvider', {
  providerName: 'JenkinsProvider',
  serverUrl: 'http://myjenkins.com:8080',
  version: '2',
});

pipeline.addStage({
  name: 'Build',
  actions: [
    jenkinsProvider.toCodePipelineBuildAction({
      actionName: 'JenkinsBuild',
      projectName: 'JenkinsProject1',
      inputArtifact: sourceAction.outputArtifact,
    }),
    jenkinsProvider.toCodePipelineTestAction({
      actionName: 'JenkinsTest',
      projectName: 'JenkinsProject2',
      inputArtifact: sourceAction.outputArtifact,
    }),
    jenkinsProvider.toCodePipelineTestAction({
      actionName: 'JenkinsTest2',
      projectName: 'JenkinsProject3',
      inputArtifact: sourceAction.outputArtifact,
    }),
  ],
});

app.run();
