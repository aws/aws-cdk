import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-jenkins');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  versioned: true,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactsStore: new codepipeline.ArtifactsStore(stack, 'ArtifactsStore', { bucket })
});

const sourceStage = pipeline.addStage('Source');
bucket.addToPipeline(sourceStage, 'S3', {
  bucketKey: 'some/path',
});

const jenkinsProvider = new codepipeline.JenkinsProvider(stack, 'JenkinsProvider', {
  providerName: 'JenkinsProvider',
  serverUrl: 'http://myjenkins.com:8080',
  version: '2',
});

const buildStage = pipeline.addStage('Build');
jenkinsProvider.addToPipeline(buildStage, 'JenkinsBuild', {
  projectName: 'JenkinsProject1',
});
jenkinsProvider.addToPipelineAsTest(buildStage, 'JenkinsTest', {
  projectName: 'JenkinsProject2',
});
jenkinsProvider.addToPipelineAsTest(buildStage, 'JenkinsTest2', {
  projectName: 'JenkinsProject3',
});

app.run();
