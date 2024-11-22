import { Match, Template } from '../../../assertions';
import { App, Stack } from '../../../core';
import { ModernTestGitHubNpmPipeline, PIPELINE_ENV, sortByRunOrder, TestApp, ThreeStackApp, TwoStackApp } from '../testhelpers';

let app: App;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

test('interdependent stacks are in the right order', () => {
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  pipeline.addStage(new TwoStackApp(app, 'MyApp'));

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
});

test('multiple independent stacks go in parallel', () => {
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  pipeline.addStage(new ThreeStackApp(app, 'MyApp'));

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
});
