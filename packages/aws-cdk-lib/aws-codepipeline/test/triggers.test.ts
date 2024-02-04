import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';
import { Match, Template } from '../../assertions';
import { CodeStarConnectionsSourceAction } from '../../aws-codepipeline-actions';
import * as cdk from '../../core';
import * as codepipeline from '../lib';

describe('triggers', () => {
  let stack: cdk.Stack;
  let sourceArtifact: codepipeline.Artifact;
  let sourceAction: codepipeline.Action;
  let buildAction: codepipeline.Action;

  beforeEach(() => {
    stack = new cdk.Stack();
    sourceArtifact = new codepipeline.Artifact();
    sourceAction = new CodeStarConnectionsSourceAction({
      actionName: 'CodeStarConnectionsSourceAction',
      output: sourceArtifact,
      connectionArn: 'connection',
      owner: 'owner',
      repo: 'repo',
    });
    buildAction = new FakeBuildAction({
      actionName: 'FakeBuild',
      input: sourceArtifact,
    });
  });

  test('can specify triggers', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [{
            excludedTags: ['exclude1', 'exclude2'],
            includedTags: ['include1', 'include2'],
          }],
        },
      }],
    });

    testPipelineSetup(pipeline, [sourceAction], [buildAction]);

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      PipelineType: 'V2',
      Triggers: [{
        GitConfiguration: {
          SourceActionName: 'CodeStarConnectionsSourceAction',
          Push: [{
            Tags: {
              Excludes: ['exclude1', 'exclude2'],
              Includes: ['include1', 'include2'],
            },
          }],
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
  });

  test('empty excludedTags for trigger is set to undefined', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [{
            excludedTags: [],
            includedTags: ['include1', 'include2'],
          }],
        },
      }],
    });

    testPipelineSetup(pipeline, [sourceAction], [buildAction]);

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      PipelineType: 'V2',
      Triggers: [{
        GitConfiguration: {
          SourceActionName: 'CodeStarConnectionsSourceAction',
          Push: [{
            Tags: {
              Excludes: Match.absent(),
              Includes: ['include1', 'include2'],
            },
          }],
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
  });

  test('empty includedTags for trigger is set to undefined', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [{
            excludedTags: ['excluded1', 'excluded2'],
            includedTags: [],
          }],
        },
      }],
    });

    testPipelineSetup(pipeline, [sourceAction], [buildAction]);

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      PipelineType: 'V2',
      Triggers: [{
        GitConfiguration: {
          SourceActionName: 'CodeStarConnectionsSourceAction',
          Push: [{
            Tags: {
              Excludes: ['excluded1', 'excluded2'],
              Includes: Match.absent(),
            },
          }],
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
  });

  test('throw if length of excludes is greater than 8', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [{
              excludedTags: ['exclude1', 'exclude2', 'exclude3', 'exclude4', 'exclude5', 'exclude6', 'exclude7', 'exclude8', 'exclude9'],
              includedTags: ['include1', 'include2'],
            }],
          },
        }],
      });
    }).toThrow(/maximum length of excludedTags is 8, got 9 at triggers\[0\].gitConfiguration.pushFilter\[0\]/);
  });

  test('throw if length of excludes is greater than 8', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [{
              excludedTags: ['exclude1', 'exclude2'],
              includedTags: ['include1', 'include2', 'include3', 'include4', 'include5', 'include6', 'include7', 'include8', 'include9'],
            }],
          },
        }],
      });
    }).toThrow(/maximum length of includedTags is 8, got 9 at triggers\[0\].gitConfiguration.pushFilter\[0\]/);
  });

  test('throw if provider of sourceAction is not \'CodeStarSourceConnection\'', () => {
    const fakeAction = new FakeSourceAction({
      actionName: 'FakeSource',
      output: sourceArtifact,
    });

    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction: fakeAction,
            pushFilter: [{
              excludedTags: ['exclude1', 'exclude2'],
              includedTags: ['include1', 'include2'],
            }],
          },
        }],
      });
    }).toThrow(/provider for actionProperties in sourceAction must be 'CodeStarSourceConnection', got 'Fake' at triggers\[0\]/);
  });

  test('throw if triggers are specified when pipelineType is not set to V2', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V1,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [{
              excludedTags: ['exclude1', 'exclude2'],
              includedTags: ['include1', 'include2'],
            }],
          },
        }],
      });
    }).toThrow(/triggers can only be used with V2 pipelines, `PipelineType.V2` must be specified for `pipelineType`/);
  });
});

// Adding 2 stages with actions so pipeline validation will pass
function testPipelineSetup(pipeline: codepipeline.Pipeline, sourceActions?: codepipeline.IAction[], buildActions?: codepipeline.IAction[]) {
  pipeline.addStage({
    stageName: 'Source',
    actions: sourceActions,
  });

  pipeline.addStage({
    stageName: 'Build',
    actions: buildActions,
  });
}