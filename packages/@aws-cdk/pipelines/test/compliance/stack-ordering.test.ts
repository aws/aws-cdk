import { Match, Template } from '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import { behavior, LegacyTestGitHubNpmPipeline, ModernTestGitHubNpmPipeline, OneStackApp, PIPELINE_ENV, sortByRunOrder, TestApp, ThreeStackApp, TwoStackApp } from '../testhelpers';

let app: App;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

behavior('interdependent stacks are in the right order', (suite) => {
  suite.legacy(() => {
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new TwoStackApp(app, 'MyApp'));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addStage(new TwoStackApp(app, 'MyApp'));

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Name: 'MyApp',
        Actions: sortByRunOrder([
          Match.objectLike({ Name: 'Stack1.Prepare' }),
          Match.objectLike({ Name: 'Stack1.Deploy' }),
          Match.objectLike({ Name: 'Stack2.Prepare' }),
          Match.objectLike({ Name: 'Stack2.Deploy' }),
        ]),
      }]),
    });
  }
});

behavior('multiple independent stacks go in parallel', (suite) => {
  suite.legacy(() => {
    // WHEN
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new ThreeStackApp(app, 'MyApp'));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addStage(new ThreeStackApp(app, 'MyApp'));

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Name: 'MyApp',
        Actions: sortByRunOrder([
          // 1 and 2 in parallel
          Match.objectLike({ Name: 'Stack1.Prepare' }),
          Match.objectLike({ Name: 'Stack2.Prepare' }),
          Match.objectLike({ Name: 'Stack1.Deploy' }),
          Match.objectLike({ Name: 'Stack2.Deploy' }),
          // Then 3
          Match.objectLike({ Name: 'Stack3.Prepare' }),
          Match.objectLike({ Name: 'Stack3.Deploy' }),
        ]),
      }]),
    });
  }
});

behavior('user can request manual change set approvals', (suite) => {
  suite.legacy(() => {
    // WHEN
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new TwoStackApp(app, 'MyApp'), {
      manualApprovals: true,
    });

    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Name: 'MyApp',
        Actions: sortByRunOrder([
          Match.objectLike({ Name: 'Stack1.Prepare' }),
          Match.objectLike({ Name: 'ManualApproval' }),
          Match.objectLike({ Name: 'Stack1.Deploy' }),
          Match.objectLike({ Name: 'Stack2.Prepare' }),
          Match.objectLike({ Name: 'ManualApproval2' }),
          Match.objectLike({ Name: 'Stack2.Deploy' }),
        ]),
      }]),
    });
  });

  // No change set approvals in Modern API for now.
  suite.doesNotApply.modern();
});

behavior('user can request extra runorder space between prepare and deploy', (suite) => {
  suite.legacy(() => {
    // WHEN
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new TwoStackApp(app, 'MyApp'), {
      extraRunOrderSpace: 1,
    });

    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Name: 'MyApp',
        Actions: sortByRunOrder([
          Match.objectLike({
            Name: 'Stack1.Prepare',
            RunOrder: 1,
          }),
          Match.objectLike({
            Name: 'Stack1.Deploy',
            RunOrder: 3,
          }),
          Match.objectLike({
            Name: 'Stack2.Prepare',
            RunOrder: 4,
          }),
          Match.objectLike({
            Name: 'Stack2.Deploy',
            RunOrder: 6,
          }),
        ]),
      }]),
    });
  });

  // No change set approvals in Modern API for now.
  suite.doesNotApply.modern();
});

behavior('user can request both manual change set approval and extraRunOrderSpace', (suite) => {
  suite.legacy(() => {
    // WHEN
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new OneStackApp(app, 'MyApp'), {
      extraRunOrderSpace: 1,
      manualApprovals: true,
    });

    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Name: 'MyApp',
        Actions: sortByRunOrder([
          Match.objectLike({
            Name: 'Stack.Prepare',
            RunOrder: 1,
          }),
          Match.objectLike({
            Name: 'ManualApproval',
            RunOrder: 2,
          }),
          Match.objectLike({
            Name: 'Stack.Deploy',
            RunOrder: 4,
          }),
        ]),
      }]),
    });
  });

  // No change set approvals in Modern API for now.
  suite.doesNotApply.modern();
});
