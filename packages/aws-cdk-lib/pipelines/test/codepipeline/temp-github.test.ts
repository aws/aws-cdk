// done

import * as cdk from '../../../core';
import { Stack } from '../../../core';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from '../../../pipelines';

let app: cdk.App = new cdk.App();

const stack = new Stack(app, 'PipeStack', {});

const githubPipeline = new CodePipeline(stack, 'GithubPipeline', {
  pipelineName: 'GithubPipeline1',
  synth: new CodeBuildStep('SynthStep1', {
    input: CodePipelineSource.gitHub('me/rep', 'b1', {
      actionName: 'branch1',
    }),
    additionalInputs: {
      'source-test-branch': CodePipelineSource.gitHub('me/rep', 'b2', {
        actionName: 'branch2',
      }),
      'other-branch': CodePipelineSource.gitHub('me/rep', 'b3', {
        actionName: 'branch3',
      }),
    },
    installCommands: [
      'npm install -g aws-cdk',
    ],
    commands: [
      'npm ci',
      'npm run build',
      'cdk synth',
    ],
  }),
});

test('github synths', () => {
  const assembly = app.synth();
  expect(assembly.stacks.length).toEqual(1);
});
