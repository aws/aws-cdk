import cfn = require('@aws-cdk/aws-cloudformation');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cpactions = require('@aws-cdk/aws-codepipeline-actions');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cicd = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'CICD');
const pipeline = new codepipeline.Pipeline(stack, 'CodePipeline', {
  artifactBucket: new s3.Bucket(stack, 'ArtifactBucket', {
    removalPolicy: cdk.RemovalPolicy.Destroy
  })
});
const sourceOutput = new codepipeline.Artifact('Artifact_CICDGitHubF8BA7ADD');
const source = new cpactions.GitHubSourceAction({
  actionName: 'GitHub',
  owner: 'awslabs',
  repo: 'aws-cdk',
  oauthToken: cdk.SecretValue.plainText('DummyToken'),
  trigger: cpactions.GitHubTrigger.Poll,
  output: sourceOutput,
});
pipeline.addStage({
  stageName: 'Source',
  actions: [source],
});
const stage = pipeline.addStage({ stageName: 'Deploy' });
new cicd.PipelineDeployStackAction(stack, 'DeployStack', {
  stage,
  stack,
  changeSetName: 'CICD-ChangeSet',
  createChangeSetRunOrder: 10,
  executeChangeSetRunOrder: 999,
  input: sourceOutput,
  adminPermissions: false,
  capabilities: [cfn.CloudFormationCapabilities.None],
});

app.synth();
