import { Template, Match } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import * as cdkp from '../../lib';
import { PIPELINE_ENV, TestApp, ModernTestGitHubNpmPipeline, AppWithOutput } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

test('additionalinputs creates the right commands', () => {
  // WHEN
  new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: new cdkp.CodeBuildStep('Synth', {
      commands: ['/bin/true'],
      input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
      additionalInputs: {
        'some/deep/directory': cdkp.CodePipelineSource.gitHub('test2/test2', 'main'),
      },
    }),
  });

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    Source: {
      BuildSpec: Match.serializedJson(Match.objectLike({
        phases: {
          install: {
            commands: [
              '[ ! -d "some/deep/directory" ] || { echo \'additionalInputs: "some/deep/directory" must not exist yet. If you want to merge multiple artifacts, use a "cp" command.\'; exit 1; } && mkdir -p -- "some/deep" && ln -s -- "$CODEBUILD_SRC_DIR_test2_test2_Source" "some/deep/directory"',
            ],
          },
        },
      })),
    },
  });
});

test('envFromOutputs works even with very long stage and stack names', () => {
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

  const myApp = new AppWithOutput(app, 'Alpha'.repeat(20), {
    stackId: 'Stack'.repeat(20),
  });

  pipeline.addStage(myApp, {
    post: [
      new cdkp.ShellStep('Approve', {
        commands: ['/bin/true'],
        envFromCfnOutputs: {
          THE_OUTPUT: myApp.theOutput,
        },
      }),
    ],
  });

  // THEN - did not throw an error about identifier lengths
});