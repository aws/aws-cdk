import cfn = require('@aws-cdk/aws-cloudformation');
import code = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cicd = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'CICD');
const pipeline = new code.Pipeline(stack, 'CodePipeline', {
  artifactBucket: new s3.Bucket(stack, 'ArtifactBucket', {
    removalPolicy: cdk.RemovalPolicy.Destroy
  })
});
const source = new code.GitHubSourceAction({
  actionName: 'GitHub',
  owner: 'awslabs',
  repo: 'aws-cdk',
  oauthToken: new cdk.Secret('DummyToken'),
  pollForSourceChanges: true,
  outputArtifactName: 'Artifact_CICDGitHubF8BA7ADD',
});
pipeline.addStage({
  name: 'Source',
  actions: [source],
});
const stage = pipeline.addStage({ name: 'Deploy' });
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
