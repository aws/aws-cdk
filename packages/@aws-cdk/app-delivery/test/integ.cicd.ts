import code = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cicd = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'CICD');
const pipeline = new code.Pipeline(stack, 'CodePipeline', {
  artifactBucket: new s3.Bucket(stack, 'ArtifactBucket'),
});
const source = new code.GitHubSourceAction(stack, 'GitHub', {
  stage: pipeline.addStage('Source'),
  owner: 'awslabs',
  repo: 'aws-cdk',
  oauthToken: new cdk.Secret('DummyToken'),
});
new cicd.PipelineDeployStackAction(stack, 'DeployStack', {
  stage: pipeline.addStage('Deploy'),
  stack,
  changeSetName: 'CICD-ChangeSet',
  createChangeSetRunOrder: 10,
  executeChangeSetRunOrder: 999,
  inputArtifact: source.outputArtifact,
});

app.run();
