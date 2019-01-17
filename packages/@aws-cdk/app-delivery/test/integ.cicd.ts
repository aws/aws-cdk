import cfn = require('@aws-cdk/aws-cloudformation');
import code = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cicd = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'CICD');
const pipeline = new code.Pipeline(stack, 'CodePipeline', {
  artifactsStore: new code.ArtifactsStore(stack, 'ArtifactsStore', {
    bucket: new s3.Bucket(stack, 'ArtifactBucket', {
      removalPolicy: cdk.RemovalPolicy.Destroy
    })
  })
});
const source = new code.GitHubSourceAction(stack, 'GitHub', {
  stage: pipeline.addStage('Source'),
  owner: 'awslabs',
  repo: 'aws-cdk',
  oauthToken: new cdk.Secret('DummyToken'),
  pollForSourceChanges: true,
});
const stage = pipeline.addStage('Deploy');
new cicd.PipelineDeployStackAction(stack, 'DeployStack', {
  stage,
  stack,
  changeSetName: 'CICD-ChangeSet',
  createChangeSetRunOrder: 10,
  executeChangeSetRunOrder: 999,
  inputArtifact: source.outputArtifact,
  adminPermissions: false,
  capabilities: cfn.CloudFormationCapabilities.None,
});

app.run();
