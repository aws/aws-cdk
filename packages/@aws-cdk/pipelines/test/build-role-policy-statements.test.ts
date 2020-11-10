import { arrayWith, deepObjectLike } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import * as cdkp from '../lib';
import { PIPELINE_ENV, TestApp, TestGitHubNpmPipeline } from './testutil';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStackPolicy', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

test('Build project includes codeartifact policy statements for role', () => {
  // WHEN
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
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
