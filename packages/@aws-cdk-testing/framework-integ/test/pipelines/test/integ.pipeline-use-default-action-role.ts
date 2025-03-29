import * as pipelines from 'aws-cdk-lib/pipelines';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-integ-test-service-role-for-actions');
const repo = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'my-repo',
});
const pipelineServiceRole = new iam.Role(stack, 'pipeline-role', {
  assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
  description: 'Service role for CodePipeline with CodeBuild, S3, and CodeDeploy permissions',
});

// Add CodeBuild permissions
pipelineServiceRole.addToPolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    'codebuild:BatchGetBuilds',
    'codebuild:StartBuild',
    'codebuild:StopBuild',
    'codebuild:RetryBuild',
  ],
  resources: ['*'],
}));

new pipelines.CodePipeline(stack, 'integ-test-default-role-pipeline', {
  pipelineName: 'integ-test-default-role-pipeline',
  selfMutation: false,
  synth: new pipelines.ShellStep('Synth', {
    input: pipelines.CodePipelineSource.codeCommit(repo, 'main'),
    commands: [
      'npm ci',
      'npm run build',
      'npx cdk synth',
    ],
  }),
  codeBuildDefaults: {
    buildEnvironment: {
      buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0,
      computeType: codebuild.ComputeType.SMALL,
    },
    cache: codebuild.Cache.local(codebuild.LocalCacheMode.DOCKER_LAYER),
  },
  role: pipelineServiceRole,
  usePipelineRoleForActions: true,

});
const integrationTest = new IntegTest(app, 'codepipeline-integ-test', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

const awsApiCall1 = integrationTest.assertions.awsApiCall('CodePipeline', 'getPipeline', { name: 'integ-test-default-role-pipeline' });

awsApiCall1.assertAtPath('pipeline.name', ExpectedResult.stringLikeRegexp('integ-test-default-role-pipeline'));
awsApiCall1.assertAtPath('pipeline.roleArn', ExpectedResult.stringLikeRegexp(pipelineServiceRole.roleArn));

app.synth();
