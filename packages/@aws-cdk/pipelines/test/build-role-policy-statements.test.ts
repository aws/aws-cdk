import { arrayWith, deepObjectLike } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import * as cdkp from '../lib';
import { PIPELINE_ENV, TestApp, TestGitHubNpmPipeline } from './testutil';

let app: TestApp;
let pipelineStack: Stack;
let sourceArtifact: codepipeline.Artifact;
let cloudAssemblyArtifact: codepipeline.Artifact;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStackPolicy', { env: PIPELINE_ENV });
  sourceArtifact = new codepipeline.Artifact();
  cloudAssemblyArtifact = new codepipeline.Artifact('CloudAsm');
});

afterEach(() => {
  app.cleanup();
});

test('Build project includes codeartifact policy statements for role', () => {
  // WHEN
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    sourceArtifact,
    cloudAssemblyArtifact,
    synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
      sourceArtifact,
      cloudAssemblyArtifact,
      rolePolicyStatements: [
        new PolicyStatement({
          actions: ['codeartifact:*', 'sts:GetServiceBearerToken'],
          resources: ['arn:my:arn'],
        }),
      ],
    }),
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: arrayWith(deepObjectLike({
        Action: [
          'codeartifact:*',
          'sts:GetServiceBearerToken',
        ],
        Resource: 'arn:my:arn',
      })),
    },
  });
});
