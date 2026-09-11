import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codebuild-service-role-override');

const repository = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'MyIntegTestTempRepo',
});
const bucket = new s3.Bucket(stack, 'MyBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
});

const sourceOutput = new codepipeline.Artifact();
const sourceAction = new cpactions.CodeCommitSourceAction({
  actionName: 'Source',
  repository,
  output: sourceOutput,
});
pipeline.addStage({
  stageName: 'Source',
  actions: [
    sourceAction,
  ],
});

const project = new codebuild.PipelineProject(stack, 'MyBuildProject', {
  grantReportGroupPermissions: false,
});
const customBuildRole = new iam.Role(stack, 'CustomBuildRole', {
  assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
});
const buildAction = new cpactions.CodeBuildAction({
  actionName: 'Build',
  project,
  input: sourceOutput,
  serviceRoleOverride: customBuildRole,
});
pipeline.addStage({
  stageName: 'Build',
  actions: [
    buildAction,
  ],
});

app.synth();
