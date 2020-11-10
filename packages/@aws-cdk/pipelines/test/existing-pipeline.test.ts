import { objectLike } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cp from '@aws-cdk/aws-codepipeline';
import { Stack } from '@aws-cdk/core';
import * as cdkp from '../lib';
import { PIPELINE_ENV, TestApp, TestGitHubAction, TestGitHubSource } from './testutil';

let app: TestApp;
let pipelineStack: Stack;
let sourceArtifact: cp.Artifact;
let cloudAssemblyArtifact: cp.Artifact;
let codePipeline: cp.Pipeline;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  sourceArtifact = new cp.Artifact();
});

afterEach(() => {
  app.cleanup();
});

describe('with empty existing CodePipeline', () => {
  beforeEach(() => {
    codePipeline = new cp.Pipeline(pipelineStack, 'CodePipeline');
  });

  test('both actions are required', () => {
    // WHEN
    expect(() => {
      new cdkp.CdkPipeline(pipelineStack, 'Cdk', { codePipeline });
    }).toThrow(/You must pass a 'source'/);
  });

  test('can give both actions', () => {
    // WHEN
    new cdkp.CdkPipeline(pipelineStack, 'Cdk', {
      codePipeline,
      source: new TestGitHubSource(),
      synthAction: cdkp.SimpleSynthAction.standardNpmSynth(),
    });

    // THEN
    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        objectLike({ Name: 'Source' }),
        objectLike({ Name: 'Build' }),
        objectLike({ Name: 'UpdatePipeline' }),
      ],
    });
  });
});

describe('with custom Source stage in existing Pipeline', () => {
  beforeEach(() => {
    codePipeline = new cp.Pipeline(pipelineStack, 'CodePipeline', {
      stages: [
        {
          stageName: 'CustomSource',
          actions: [new TestGitHubAction(sourceArtifact)],
        },
      ],
    });
  });

  test('Work with synthAction', () => {
    // WHEN
    new cdkp.CdkPipeline(pipelineStack, 'Cdk', {
      codePipeline,
      sourceArtifact,
      synthAction: cdkp.SimpleSynthAction.standardNpmSynth(),
    });

    // THEN
    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        objectLike({ Name: 'CustomSource' }),
        objectLike({ Name: 'Build' }),
        objectLike({ Name: 'UpdatePipeline' }),
      ],
    });
  });

  test('Fails without sourceArtifact', () => {
    // WHEN
    expect(() => {
      new cdkp.CdkPipeline(pipelineStack, 'Cdk', {
        codePipeline,
        synthAction: cdkp.SimpleSynthAction.standardNpmSynth(),
      });
    }).toThrow(/You must pass a 'source'/);
  });
});

describe('with Source and Build stages in existing Pipeline', () => {
  beforeEach(() => {
    cloudAssemblyArtifact = new cp.Artifact();
    const synthAction = cdkp.SimpleSynthAction.standardNpmSynth();
    synthAction.configureArtifacts(sourceArtifact, cloudAssemblyArtifact);

    codePipeline = new cp.Pipeline(pipelineStack, 'CodePipeline', {
      stages: [
        {
          stageName: 'CustomSource',
          actions: [new TestGitHubAction(sourceArtifact)],
        },
        {
          stageName: 'CustomBuild',
          actions: [synthAction],
        },
      ],
    });
  });

  test('can supply no actions', () => {
    // WHEN
    new cdkp.CdkPipeline(pipelineStack, 'Cdk', {
      codePipeline,
      sourceArtifact,
      cloudAssemblyArtifact,
    });

    // THEN
    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        objectLike({ Name: 'CustomSource' }),
        objectLike({ Name: 'CustomBuild' }),
        objectLike({ Name: 'UpdatePipeline' }),
      ],
    });
  });
});