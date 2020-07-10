import { anything, arrayWith, deepObjectLike, encodedJson } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { CfnOutput, Construct, Stack, Stage, StageProps } from '@aws-cdk/core';
import * as cdkp from '../lib';
import {  } from './testmatchers';
import { BucketStack, PIPELINE_ENV, TestApp, TestGitHubNpmPipeline } from './testutil';

let app: TestApp;
let pipelineStack: Stack;
let pipeline: cdkp.CdkPipeline;
let sourceArtifact: codepipeline.Artifact;
let cloudAssemblyArtifact: codepipeline.Artifact;
let integTestArtifact: codepipeline.Artifact;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  sourceArtifact = new codepipeline.Artifact();
  cloudAssemblyArtifact = new codepipeline.Artifact('CloudAsm');
  integTestArtifact = new codepipeline.Artifact('IntegTests');
  pipeline = new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    sourceArtifact,
    cloudAssemblyArtifact,
    synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
      sourceArtifact,
      cloudAssemblyArtifact,
      additionalArtifacts: [{ directory: 'test', artifact: integTestArtifact }],
    }),
  });
});

afterEach(() => {
  app.cleanup();
});

test('can use stack outputs as validation inputs', () => {
  // GIVEN
  const stage = new AppWithStackOutput(app, 'MyApp');

  // WHEN
  const pipeStage = pipeline.addApplicationStage(stage);
  pipeStage.addActions(new cdkp.ShellScriptAction({
    actionName: 'TestOutput',
    useOutputs: {
      BUCKET_NAME: pipeline.stackOutput(stage.output),
    },
    commands: ['echo $BUCKET_NAME'],
  }));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'MyApp',
      Actions: arrayWith(
        deepObjectLike({
          Name: 'Stack.Deploy',
          OutputArtifacts: [{ Name: anything() }],
          Configuration: {
            OutputFileName: 'outputs.json',
          },
        }),
        deepObjectLike({
          ActionTypeId: {
            Provider: 'CodeBuild',
          },
          Configuration: {
            ProjectName: anything(),
          },
          InputArtifacts: [{ Name: anything() }],
          Name: 'TestOutput',
        }),
      ),
    }),
  });

  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          build: {
            commands: [
              'set -eu',
              'export BUCKET_NAME="$(node -pe \'require(process.env.CODEBUILD_SRC_DIR + "/outputs.json")["BucketName"]\')"',
              'echo $BUCKET_NAME',
            ],
          },
        },
      })),
      Type: 'CODEPIPELINE',
    },
  });
});

test('can use additional files from source', () => {
  // WHEN
  pipeline.addStage('Test').addActions(new cdkp.ShellScriptAction({
    actionName: 'UseSources',
    additionalArtifacts: [sourceArtifact],
    commands: ['true'],
  }));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'Test',
      Actions: [
        deepObjectLike({
          Name: 'UseSources',
          InputArtifacts: [ { Name: 'Artifact_Source_GitHub' } ],
        }),
      ],
    }),
  });
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          build: {
            commands: [
              'set -eu',
              'true',
            ],
          },
        },
      })),
    },
  });
});

test('can use additional files from build', () => {
  // WHEN
  pipeline.addStage('Test').addActions(new cdkp.ShellScriptAction({
    actionName: 'UseBuildArtifact',
    additionalArtifacts: [integTestArtifact],
    commands: ['true'],
  }));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'Test',
      Actions: [
        deepObjectLike({
          Name: 'UseBuildArtifact',
          InputArtifacts: [ { Name: 'IntegTests' } ],
        }),
      ],
    }),
  });
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          build: {
            commands: [
              'set -eu',
              'true',
            ],
          },
        },
      })),
    },
  });
});

class AppWithStackOutput extends Stage {
  public readonly output: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    const stack = new BucketStack(this, 'Stack');

    this.output = new CfnOutput(stack, 'BucketName', {
      value: stack.bucket.bucketName,
    });
  }
}