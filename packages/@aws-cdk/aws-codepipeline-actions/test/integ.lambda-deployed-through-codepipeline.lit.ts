/// !cdk-integ PipelineStack
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import codepipeline_actions = require('../lib');

const app = new cdk.App();

/// !show
const lambdaStack = new cdk.Stack(app, 'LambdaStack');
const lambdaCode = lambda.Code.fromCfnParameters();
new lambda.Function(lambdaStack, 'Lambda', {
  code: lambdaCode,
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_8_10,
});
// other resources that your Lambda needs, added to the lambdaStack...

const pipelineStack = new cdk.Stack(app, 'PipelineStack');
const pipeline = new codepipeline.Pipeline(pipelineStack, 'Pipeline');

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
const cdkBuildProject = new codebuild.PipelineProject(pipelineStack, 'CdkBuildProject', {
  environment: {
    buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
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
const lambdaBuildProject = new codebuild.PipelineProject(pipelineStack, 'LambdaBuildProject', {
  environment: {
    buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
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
      parameterOverrides: {
        ...lambdaCode.assign(lambdaBuildOutput.s3Location),
      },
      extraInputs: [
        lambdaBuildOutput,
      ],
    }),
  ],
});
