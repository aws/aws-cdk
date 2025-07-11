/// !cdk-integ PipelineStack
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

/// !show
const lambdaStack = new cdk.Stack(app, 'LambdaStack');
const lambdaCode = lambda.Code.fromCfnParameters();
new lambda.Function(lambdaStack, 'Lambda', {
  code: lambdaCode,
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});
// other resources that your Lambda needs, added to the lambdaStack...

const pipelineStack = new cdk.Stack(app, 'PipelineStack');
const pipeline = new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
  crossAccountKeys: true,
});

// add the source code repository containing this code to your Pipeline,
// and the source code of the Lambda Function, if they're separate
const cdkSourceOutput = new codepipeline.Artifact();
const cdkSourceAction = new codepipeline_actions.CodeCommitSourceAction({
  repository: new codecommit.Repository(pipelineStack, 'CdkCodeRepo', {
    repositoryName: 'CdkCodeRepo',
  }),
  actionName: 'CdkCode_Source',
  output: cdkSourceOutput,
});
const lambdaSourceOutput = new codepipeline.Artifact();
const lambdaSourceAction = new codepipeline_actions.CodeCommitSourceAction({
  repository: new codecommit.Repository(pipelineStack, 'LambdaCodeRepo', {
    repositoryName: 'LambdaCodeRepo',
  }),
  actionName: 'LambdaCode_Source',
  output: lambdaSourceOutput,
});
pipeline.addStage({
  stageName: 'Source',
  actions: [cdkSourceAction, lambdaSourceAction],
});

// synthesize the Lambda CDK template, using CodeBuild
// the below values are just examples, assuming your CDK code is in TypeScript/JavaScript -
// adjust the build environment and/or commands accordingly
const cdkBuildProject = new codebuild.Project(pipelineStack, 'CdkBuildProject', {
  environment: {
    buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
  },
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      install: {
        commands: 'npm install',
      },
      build: {
        commands: [
          'npm run build',
          'npm run cdk synth LambdaStack -- -o .',
        ],
      },
    },
    artifacts: {
      files: 'LambdaStack.template.yaml',
    },
  }),
});
const cdkBuildOutput = new codepipeline.Artifact();
const cdkBuildAction = new codepipeline_actions.CodeBuildAction({
  actionName: 'CDK_Build',
  project: cdkBuildProject,
  input: cdkSourceOutput,
  outputs: [cdkBuildOutput],
});

// build your Lambda code, using CodeBuild
// again, this example assumes your Lambda is written in TypeScript/JavaScript -
// make sure to adjust the build environment and/or commands if they don't match your specific situation
const lambdaBuildProject = new codebuild.Project(pipelineStack, 'LambdaBuildProject', {
  environment: {
    buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
  },
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      install: {
        commands: 'npm install',
      },
      build: {
        commands: 'npm run build',
      },
    },
    artifacts: {
      files: [
        'index.js',
        'node_modules/**/*',
      ],
    },
  }),
});
const lambdaBuildOutput = new codepipeline.Artifact();
const lambdaBuildAction = new codepipeline_actions.CodeBuildAction({
  actionName: 'Lambda_Build',
  project: lambdaBuildProject,
  input: lambdaSourceOutput,
  outputs: [lambdaBuildOutput],
});

pipeline.addStage({
  stageName: 'Build',
  actions: [cdkBuildAction, lambdaBuildAction],
});

// finally, deploy your Lambda Stack
pipeline.addStage({
  stageName: 'Deploy',
  actions: [
    new codepipeline_actions.CloudFormationCreateUpdateStackAction({
      actionName: 'Lambda_CFN_Deploy',
      templatePath: cdkBuildOutput.atPath('LambdaStack.template.yaml'),
      stackName: 'LambdaStackDeployedName',
      adminPermissions: true,
      parameterOverrides: lambdaCode.assign(lambdaBuildOutput.s3Location),
      extraInputs: [
        lambdaBuildOutput,
      ],
    }),
  ],
});
