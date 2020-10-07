import { arrayWith, objectLike } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { App, Stack, Stage, StageProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../lib';
import { sortedByRunOrder } from './testmatchers';
import { BucketStack, PIPELINE_ENV, TestApp, TestGitHubNpmPipeline } from './testutil';

let app: App;
let pipelineStack: Stack;
let pipeline: cdkp.CdkPipeline;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  pipeline = new TestGitHubNpmPipeline(pipelineStack, 'Cdk');
});

test('interdependent stacks are in the right order', () => {
  // WHEN
  pipeline.addApplicationStage(new TwoStackApp(app, 'MyApp'));

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
  pipeline.addApplicationStage(new ThreeStackApp(app, 'MyApp'));

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

test('manual approval is inserted in correct location', () => {
  // WHEN
  pipeline.addApplicationStage(new TwoStackApp(app, 'MyApp'), {
    manualApprovals: true,
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'MyApp',
      Actions: sortedByRunOrder([
        objectLike({ Name: 'Stack1.Prepare' }),
        objectLike({ Name: 'ManualApproval' }),
        objectLike({ Name: 'Stack1.Deploy' }),
        objectLike({ Name: 'Stack2.Prepare' }),
        objectLike({ Name: 'ManualApproval2' }),
        objectLike({ Name: 'Stack2.Deploy' }),
      ]),
    }),
  });
});


class TwoStackApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack2 = new BucketStack(this, 'Stack2');
    const stack1 = new BucketStack(this, 'Stack1');

    stack2.addDependency(stack1);
  }
}

/**
 * Three stacks where the last one depends on the earlier 2
 */
class ThreeStackApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack1 = new BucketStack(this, 'Stack1');
    const stack2 = new BucketStack(this, 'Stack2');
    const stack3 = new BucketStack(this, 'Stack3');

    stack3.addDependency(stack1);
    stack3.addDependency(stack2);
  }
}
