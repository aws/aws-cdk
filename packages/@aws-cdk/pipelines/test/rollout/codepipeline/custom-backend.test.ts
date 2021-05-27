/* eslint-disable import/no-extraneous-dependencies */
import { arrayWith, deepObjectLike, encodedJson, objectLike } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import { Stack } from '@aws-cdk/core';
import * as cdkp from '../../../lib';
import { OneStackApp } from '../test-app';
import { PIPELINE_ENV, TestApp, TestGitHubNpmPipeline } from '../testutil';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});


test('can do cross-account deployment if enabled', () => {
  // GIVEN
  const pipeline = new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    backend: cdkp.Backend.codePipeline({
      crossAccountKeys: true,
    }),
  });

  // WHEN
  pipeline.addApplicationStage(new OneStackApp(app, 'CrossAccount', { env: { account: 'you' } }));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'CrossAccount',
      Actions: [
        objectLike({
          Name: 'Prepare',
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::you:role/cdk-hnb659fds-deploy-role-you-',
              { Ref: 'AWS::Region' },
            ]],
          },
          Configuration: objectLike({
            StackName: 'CrossAccount-Stack',
            RoleArn: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':iam::you:role/cdk-hnb659fds-cfn-exec-role-you-',
                { Ref: 'AWS::Region' },
              ]],
            },
          }),
        }),
        objectLike({
          Name: 'Deploy',
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::you:role/cdk-hnb659fds-deploy-role-you-',
              { Ref: 'AWS::Region' },
            ]],
          },
          Configuration: objectLike({
            StackName: 'CrossAccount-Stack',
          }),
        }),
      ],
    }),
  });
});

test('action has right settings for cross-account/cross-region deployment', () => {
  // GIVEN
  const pipeline = new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    backend: cdkp.Backend.codePipeline({
      crossAccountKeys: true,
    }),
  });

  // WHEN
  pipeline.addApplicationStage(new OneStackApp(app, 'CrossBoth', { env: { account: 'you', region: 'elsewhere' } }));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'CrossBoth',
      Actions: [
        objectLike({
          Name: 'Prepare',
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::you:role/cdk-hnb659fds-deploy-role-you-elsewhere',
            ]],
          },
          Region: 'elsewhere',
          Configuration: objectLike({
            StackName: 'CrossBoth-Stack',
            RoleArn: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':iam::you:role/cdk-hnb659fds-cfn-exec-role-you-elsewhere',
              ]],
            },
          }),
        }),
        objectLike({
          Name: 'Deploy',
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::you:role/cdk-hnb659fds-deploy-role-you-elsewhere',
            ]],
          },
          Region: 'elsewhere',
          Configuration: objectLike({
            StackName: 'CrossBoth-Stack',
          }),
        }),
      ],
    }),
  });
});

test('can control fix/CLI version used in pipeline selfupdate', () => {
  // WHEN
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk2', {
    backend: cdkp.Backend.codePipeline({
      pipelineName: 'vpipe',
      cdkCliVersion: '1.2.3',
    }),
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Name: 'vpipe-selfupdate',
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          install: {
            commands: ['npm install -g aws-cdk@1.2.3'],
          },
        },
      })),
    },
  });
});
