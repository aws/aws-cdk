import * as codecommit from '../../../aws-codecommit';
import * as cdk from '../../../core';
import { Stack } from '../../../core';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from '../../../pipelines';

let app: cdk.App = new cdk.App();

const stack = new Stack(app, 'PipeStack', {});

// CodeCommit repo
const repo = new codecommit.Repository(stack, 'WorkshopRepositoryMain', {
  repositoryName: 'WorkshopRepoMain',
});

const codeCommitPipeline = new CodePipeline(stack, 'CodeCommitPipeline', {
  pipelineName: 'WorkshopPipelineName1',
  synth: new CodeBuildStep('SynthStep1', {
    input: CodePipelineSource.codeCommit(repo, 'b1', {
      actionName: 'branch1',
    }),
    additionalInputs: {
      'source-test-branch': CodePipelineSource.codeCommit(repo, 'b2', {
        actionName: 'branch2',
      }),
      'other-branch': CodePipelineSource.codeCommit(repo, 'b3', {
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

test('codeCommit synths', () => {
  const assembly = app.synth();
  expect(assembly.stacks.length).toEqual(1);
});
