import { IConstruct } from 'constructs';
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

  test('can specify multiple triggers', () => {
    const sourceArtifact2 = new codepipeline.Artifact();
    const sourceAction2 = new CodeStarConnectionsSourceAction({
      actionName: 'CodeStarConnectionsSourceAction2',
      output: sourceArtifact2,
      connectionArn: 'connection',
      owner: 'owner',
      repo: 'repo',
    });

    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [
        {
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [{
              excludedTags: ['exclude1', 'exclude2'],
              includedTags: ['include1', 'include2'],
            }],
          },
        },
        {
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction: sourceAction2,
            pushFilter: [{
              excludedTags: ['exclude1', 'exclude2'],
              includedTags: ['include1', 'include2'],
            }],
          },
        },
      ],
    });

    testPipelineSetup(pipeline, [sourceAction, sourceAction2], [buildAction]);

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      PipelineType: 'V2',
      Triggers: [
        {
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
        },
        {
          GitConfiguration: {
            SourceActionName: 'CodeStarConnectionsSourceAction2',
            Push: [{
              Tags: {
                Excludes: ['exclude1', 'exclude2'],
                Includes: ['include1', 'include2'],
              },
            }],
          },
          ProviderType: 'CodeStarSourceConnection',
        },
      ],
    });
  });

  test('can specify triggers by addTrigger method', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
    });
    pipeline.addTrigger({
      providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
      gitConfiguration: {
        sourceAction,
        pushFilter: [{
          excludedTags: ['exclude1', 'exclude2'],
          includedTags: ['include1', 'include2'],
        }],
      },
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
    }).toThrow(/maximum length of excludedTags for sourceAction with name 'CodeStarConnectionsSourceAction' is 8, got 9/);
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
    }).toThrow(/maximum length of includedTags for sourceAction with name 'CodeStarConnectionsSourceAction' is 8, got 9/);
  });

  test('throw if length of pushFilter is less than 1', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [],
          },
        }],
      });
    }).toThrow(/length of pushFilter for sourceAction with name 'CodeStarConnectionsSourceAction' must be between 1 and 3, got 0/);
  });

  test('throw if length of pushFilter is greater than 3', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [
              {
                excludedTags: ['exclude1'],
                includedTags: ['include1'],
              },
              {
                excludedTags: ['exclude2'],
                includedTags: ['include2'],
              },
              {
                excludedTags: ['exclude3'],
                includedTags: ['include3'],
              },
              {
                excludedTags: ['exclude4'],
                includedTags: ['include4'],
              },
            ],
          },
        }],
      });
    }).toThrow(/length of pushFilter for sourceAction with name 'CodeStarConnectionsSourceAction' must be between 1 and 3, got 4/);;
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
    }).toThrow(/provider for actionProperties in sourceAction with name 'FakeSource' must be 'CodeStarSourceConnection', got 'Fake'/);
  });

  test('throw if source action with duplicate action name added to the Pipeline', () => {
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
    expect(() => {
      pipeline.addTrigger({
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
        },
      });
    }).toThrow(/Trigger with duplicate source action 'CodeStarConnectionsSourceAction' added to the Pipeline/);
  });

  test('throw if triggers are specified when pipelineType is not set to V2', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
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

    testPipelineSetup(pipeline, [sourceAction], [buildAction]);

    const errors = validate(stack);

    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error).toMatch(/Triggers can only be used with V2 pipelines, `PipelineType.V2` must be specified for `pipelineType`/);
  });

  test('throw if triggers are specified when pipelineType is not set to V2 and addTrigger method is used', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V1,
    });
    pipeline.addTrigger({
      providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
      gitConfiguration: {
        sourceAction,
        pushFilter: [{
          excludedTags: ['exclude1', 'exclude2'],
          includedTags: ['include1', 'include2'],
        }],
      },
    });

    testPipelineSetup(pipeline, [sourceAction], [buildAction]);

    const errors = validate(stack);

    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error).toMatch(/Triggers can only be used with V2 pipelines, `PipelineType.V2` must be specified for `pipelineType`/);
  });
});

function validate(construct: IConstruct): string[] {
  try {
    (construct.node.root as cdk.App).synth();
    return [];
  } catch (err: any) {
    if (!('message' in err) || !err.message.startsWith('Validation failed')) {
      throw err;
    }
    return err.message.split('\n').slice(1);
  }
}

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