import { Template, Match } from '@aws-cdk/assertions';
import { BuildSpec } from '@aws-cdk/aws-codebuild';
import { Stack } from '@aws-cdk/core';
import * as cdkp from '../../lib';
import { PIPELINE_ENV, TestApp } from '../testhelpers';

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
  Template.fromStack(pipelineStack).resourceCountIs('AWS::CodeBuild::Project', 2);
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
test('throws an error when using skipBuildDefaults with commands', () => {
  expect(() => {
    new cdkp.CodeBuildStep('Synth', {
      commands: ['/bin/true'],
      input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
      skipDefaultBuildSpec: true,
    });
  }).toThrow(/not specify 'commands', 'installCommands' or 'partialBuildSpec' when specifying 'skipDefaultBuildSpec'/);
});
test('throws an error when using skipBuildDefaults with installCommands', () => {
  expect(() => {
    new cdkp.CodeBuildStep('Synth', {
      installCommands: ['/bin/true'],
      input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
      skipDefaultBuildSpec: true,
    });
  }).toThrow(/not specify 'commands', 'installCommands' or 'partialBuildSpec' when specifying 'skipDefaultBuildSpec'/);
});
test('throws an error when using skipBuildDefaults with partialBuildSpec', () => {
  expect(() => {
    new cdkp.CodeBuildStep('Synth', {
      partialBuildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            runtimeVersions: {
              python: '3.8',
            },
          },
        },
      }),
      input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
      skipDefaultBuildSpec: true,
    });
  }).toThrow(/not specify 'commands', 'installCommands' or 'partialBuildSpec' when specifying 'skipDefaultBuildSpec'/);
});
test('create build step with skipDefaultBuildSpec', () => {
  expect(() => {
    new cdkp.CodeBuildStep('Synth', {
      input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
      skipDefaultBuildSpec: true,
    });
  }).not.toThrow();
});
test('throws an error when using skipDefaultBuildSpec on synth action', () => {
  const synthAction = new cdkp.CodeBuildStep('Synth', {
    input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
    skipDefaultBuildSpec: true,
  });
  const codepipeline = new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: synthAction,
  });
  expect(() => {
    codepipeline.buildPipeline();
  }).toThrow(/not specify 'skipDefaultBuildSpec' on 'synth' found on/);
});
test('skipDefaultBuildSpec creates the correct project without buildspec', () => {
  // WHEN

  const buildAction = new cdkp.CodeBuildStep('Source', {
    input: cdkp.CodePipelineSource.gitHub('source/source', 'main'),
    skipDefaultBuildSpec: true,
  });

  const synthAction = new cdkp.CodeBuildStep('Synth', {
    commands: ['/bin/true'],
    input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
    additionalInputs: {
      source: buildAction,
    },
  });
  new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: synthAction,
  });

  // THEN
  Template.fromStack(pipelineStack).resourceCountIs('AWS::CodeBuild::Project', 3);

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    Source: {
      BuildSpec: Match.serializedJson(Match.objectLike({
        phases: {
          install: {
            commands: [
              '[ ! -d "source" ] || { echo \'additionalInputs: "source" must not exist yet. If you want to merge multiple artifacts, use a "cp" command.\'; exit 1; } && ln -s -- "$CODEBUILD_SRC_DIR_Source_Output" "source"',
            ],
          },
        },
      })),
    },
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    Source: {
      Type: 'CODEPIPELINE',
    },
  });
});

test('fullBuildSpec creates the correct project with buildspec', () => {
  // WHEN
  const buildAction = new cdkp.CodeBuildStep('Source', {
    input: cdkp.CodePipelineSource.gitHub('source/source', 'main'),
    skipDefaultBuildSpec: true,
    fullBuildSpec: BuildSpec.fromSourceFilename('buildspec-from-source-code.yml'),
  });
  const synthAction = new cdkp.CodeBuildStep('Synth', {
    commands: ['/bin/true'],
    input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
    additionalInputs: {
      source: buildAction,
    },
  });
  new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: synthAction,
  });
  // THEN
  Template.fromStack(pipelineStack).resourceCountIs('AWS::CodeBuild::Project', 3);

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    Source: {
      BuildSpec: Match.serializedJson(Match.objectLike({
        phases: {
          install: {
            commands: [
              '[ ! -d "source" ] || { echo \'additionalInputs: "source" must not exist yet. If you want to merge multiple artifacts, use a "cp" command.\'; exit 1; } && ln -s -- "$CODEBUILD_SRC_DIR_Source_Output" "source"',
            ],
          },
        },
      })),
    },
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    Source: {
      BuildSpec: 'buildspec-from-source-code.yml',
      Type: 'CODEPIPELINE',
    },
  });
});