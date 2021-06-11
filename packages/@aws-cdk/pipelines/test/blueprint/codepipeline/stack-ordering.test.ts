/* eslint-disable import/no-extraneous-dependencies */
import { arrayWith, encodedJson, objectLike } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import { App, Stack } from '@aws-cdk/core';
import * as cdkp from '../../../lib';
import { AppWithOutput, ThreeStackApp, TwoStackApp } from '../test-app';
import { sortedByRunOrder } from '../testmatchers';
import { PIPELINE_ENV, TestApp, TestGitHubNpmPipeline } from '../testutil';

let app: App;
let pipelineStack: Stack;
let pipeline: cdkp.Pipeline;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  pipeline = new TestGitHubNpmPipeline(pipelineStack, 'Cdk');
});

test('interdependent stacks are in the right order', () => {
  // WHEN
  pipeline.addStage(new TwoStackApp(app, 'MyApp'));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'MyApp',
      Actions: sortedByRunOrder([
        objectLike({ Name: 'Stack1.Prepare' }),
        objectLike({ Name: 'Stack1.Deploy' }),
        objectLike({ Name: 'Stack2.Prepare' }),
        objectLike({ Name: 'Stack2.Deploy' }),
      ]),
    }),
  });
});

test('multiple independent stacks go in parallel', () => {
  // WHEN
  pipeline.addStage(new ThreeStackApp(app, 'MyApp'));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'MyApp',
      Actions: sortedByRunOrder([
        // 1 and 2 in parallel
        objectLike({ Name: 'Stack1.Prepare' }),
        objectLike({ Name: 'Stack2.Prepare' }),
        objectLike({ Name: 'Stack1.Deploy' }),
        objectLike({ Name: 'Stack2.Deploy' }),
        // Then 3
        objectLike({ Name: 'Stack3.Prepare' }),
        objectLike({ Name: 'Stack3.Deploy' }),
      ]),
    }),
  });
});

test('manual approval is inserted after app', () => {
  // WHEN
  pipeline.addStage(new TwoStackApp(app, 'MyApp'), {
    post: [
      new cdkp.ManualApprovalStep('Approve'),
    ],
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'MyApp',
      Actions: sortedByRunOrder([
        objectLike({ Name: 'Stack1.Prepare' }),
        objectLike({ Name: 'Stack1.Deploy' }),
        objectLike({ Name: 'Stack2.Prepare' }),
        objectLike({ Name: 'Stack2.Deploy' }),
        objectLike({ Name: 'Approve' }),
      ]),
    }),
  });
});

test('ScriptStep can use stack outputs', () => {
  const myApp = new AppWithOutput(app, 'Alpha');
  pipeline.addStage(myApp, {
    post: [
      new cdkp.ScriptStep('Approve', {
        commands: ['/bin/true'],
        envFromOutputs: {
          THE_OUTPUT: myApp.theOutput,
        },
      }),
    ],
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'Alpha',
      Actions: arrayWith(
        objectLike({
          Name: 'Stack.Deploy',
          Namespace: 'AlphaStack6B3389FA',
        }),
        objectLike({
          Name: 'Approve',
          Configuration: objectLike({
            EnvironmentVariables: encodedJson([
              { name: 'THE_OUTPUT', value: '#{AlphaStack6B3389FA.MyOutput}', type: 'PLAINTEXT' },
            ]),
          }),
        }),
      ),
    }),
  });
});