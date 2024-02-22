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

  test('can specify triggers with tags in pushFilter', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [{
            tagsExcludes: ['exclude1', 'exclude2'],
            tagsIncludes: ['include1', 'include2'],
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
            Branches: Match.absent(),
            FilePaths: Match.absent(),
          }],
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
  });

  test('can specify triggers with branches in pushFilter', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [{
            branchesExcludes: ['exclude1', 'exclude2'],
            branchesIncludes: ['include1', 'include2'],
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
            Tags: Match.absent(),
            Branches: {
              Excludes: ['exclude1', 'exclude2'],
              Includes: ['include1', 'include2'],
            },
            FilePaths: Match.absent(),
          }],
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
  });

  test('can specify triggers with branches and file paths in pushFilter', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [{
            branchesExcludes: ['exclude1', 'exclude2'],
            branchesIncludes: ['include1', 'include2'],
            filePathsExcludes: ['exclude1', 'exclude2'],
            filePathsIncludes: ['include1', 'include2'],
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
            Tags: Match.absent(),
            Branches: {
              Excludes: ['exclude1', 'exclude2'],
              Includes: ['include1', 'include2'],
            },
            FilePaths: {
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
              tagsExcludes: ['exclude1', 'exclude2'],
              tagsIncludes: ['include1', 'include2'],
            }],
          },
        },
        {
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction: sourceAction2,
            pushFilter: [{
              tagsExcludes: ['exclude1', 'exclude2'],
              tagsIncludes: ['include1', 'include2'],
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
              Branches: Match.absent(),
              FilePaths: Match.absent(),
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
          tagsExcludes: ['exclude1', 'exclude2'],
          tagsIncludes: ['include1', 'include2'],
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
            Branches: Match.absent(),
            FilePaths: Match.absent(),
          }],
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
  });

  test('empty tagsExcludes in pushFilter for trigger is set to undefined', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [{
            tagsExcludes: [],
            tagsIncludes: ['include1', 'include2'],
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
            Branches: Match.absent(),
            FilePaths: Match.absent(),
          }],
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
  });

  test('empty tagsIncludes in pushFilter for trigger is set to undefined', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [{
            tagsExcludes: ['excluded1', 'excluded2'],
            tagsIncludes: [],
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
            Branches: Match.absent(),
            FilePaths: Match.absent(),
          }],
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
  });

  test('empty branchesExcludes in pushFilter for trigger is set to undefined', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [{
            branchesExcludes: [],
            branchesIncludes: ['include1', 'include2'],
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
            Tags: Match.absent(),
            Branches: {
              Excludes: Match.absent(),
              Includes: ['include1', 'include2'],
            },
            FilePaths: Match.absent(),
          }],
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
  });

  test('empty branchesIncludes in pushFilter for trigger is set to undefined', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [{
            branchesExcludes: ['excluded1', 'excluded2'],
            branchesIncludes: [],
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
            Tags: Match.absent(),
            Branches: {
              Excludes: ['excluded1', 'excluded2'],
              Includes: Match.absent(),
            },
            FilePaths: Match.absent(),
          }],
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
  });

  test('empty filePathsExcludes in pushFilter for trigger is set to undefined', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [{
            branchesExcludes: ['exclude1', 'exclude2'],
            branchesIncludes: ['include1', 'include2'],
            filePathsExcludes: [],
            filePathsIncludes: ['include1', 'include2'],
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
            Tags: Match.absent(),
            Branches: {
              Excludes: ['exclude1', 'exclude2'],
              Includes: ['include1', 'include2'],
            },
            FilePaths: {
              Excludes: Match.absent(),
              Includes: ['include1', 'include2'],
            },
          }],
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
  });

  test('empty filePathsIncludes in pushFilter for trigger is set to undefined', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [{
            branchesExcludes: ['exclude1', 'exclude2'],
            branchesIncludes: ['include1', 'include2'],
            filePathsExcludes: ['exclude1', 'exclude2'],
            filePathsIncludes: [],
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
            Tags: Match.absent(),
            Branches: {
              Excludes: ['exclude1', 'exclude2'],
              Includes: ['include1', 'include2'],
            },
            FilePaths: {
              Excludes: ['exclude1', 'exclude2'],
              Includes: Match.absent(),
            },
          }],
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
  });

  test('throw if length of tagsExcludes in pushFilter is greater than 8', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [{
              tagsExcludes: ['exclude1', 'exclude2', 'exclude3', 'exclude4', 'exclude5', 'exclude6', 'exclude7', 'exclude8', 'exclude9'],
              tagsIncludes: ['include1', 'include2'],
            }],
          },
        }],
      });
    }).toThrow(/maximum length of tagsExcludes in pushFilter for sourceAction with name 'CodeStarConnectionsSourceAction' is 8, got 9/);
  });

  test('throw if length of tagsIncludes in pushFilter is greater than 8', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [{
              tagsExcludes: ['exclude1', 'exclude2'],
              tagsIncludes: ['include1', 'include2', 'include3', 'include4', 'include5', 'include6', 'include7', 'include8', 'include9'],
            }],
          },
        }],
      });
    }).toThrow(/maximum length of tagsIncludes in pushFilter for sourceAction with name 'CodeStarConnectionsSourceAction' is 8, got 9/);
  });

  test('throw if length of branchesExcludes in pushFilter is greater than 8', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [{
              branchesExcludes: ['exclude1', 'exclude2', 'exclude3', 'exclude4', 'exclude5', 'exclude6', 'exclude7', 'exclude8', 'exclude9'],
              branchesIncludes: ['include1', 'include2'],
            }],
          },
        }],
      });
    }).toThrow(/maximum length of branchesExcludes in pushFilter for sourceAction with name 'CodeStarConnectionsSourceAction' is 8, got 9/);
  });

  test('throw if length of branchesIncludes in pushFilter is greater than 8', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [{
              branchesExcludes: ['exclude1', 'exclude2'],
              branchesIncludes: ['include1', 'include2', 'include3', 'include4', 'include5', 'include6', 'include7', 'include8', 'include9'],
            }],
          },
        }],
      });
    }).toThrow(/maximum length of branchesIncludes in pushFilter for sourceAction with name 'CodeStarConnectionsSourceAction' is 8, got 9/);
  });

  test('throw if length of filePathsExcludes in pushFilter is greater than 8', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [{
              branchesExcludes: ['exclude1', 'exclude2'],
              branchesIncludes: ['include1', 'include2'],
              filePathsExcludes: ['exclude1', 'exclude2', 'exclude3', 'exclude4', 'exclude5', 'exclude6', 'exclude7', 'exclude8', 'exclude9'],
              filePathsIncludes: ['include1', 'include2'],
            }],
          },
        }],
      });
    }).toThrow(/maximum length of filePathsExcludes in pushFilter for sourceAction with name 'CodeStarConnectionsSourceAction' is 8, got 9/);
  });

  test('throw if length of filePathsIncludes in pushFilter is greater than 8', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [{
              branchesExcludes: ['exclude1', 'exclude2'],
              branchesIncludes: ['include1', 'include2'],
              filePathsExcludes: ['exclude1', 'exclude2'],
              filePathsIncludes: ['include1', 'include2', 'include3', 'include4', 'include5', 'include6', 'include7', 'include8', 'include9'],
            }],
          },
        }],
      });
    }).toThrow(/maximum length of filePathsIncludes in pushFilter for sourceAction with name 'CodeStarConnectionsSourceAction' is 8, got 9/);
  });

  test('throw if tags and branches are specified in pushFilter', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [{
              tagsExcludes: ['exclude1', 'exclude2'],
              branchesExcludes: ['exclude1', 'exclude2'],
            }],
          },
        }],
      });
    }).toThrow(/cannot specify both tags and branches in pushFilter for sourceAction with name 'CodeStarConnectionsSourceAction'/);
  });

  test('throw if filePaths without branches is specified in pushFilter', () => {
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        triggers: [{
          providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
          gitConfiguration: {
            sourceAction,
            pushFilter: [{
              filePathsExcludes: ['exclude1', 'exclude2'],
            }],
          },
        }],
      });
    }).toThrow(/cannot specify filePaths without branches in pushFilter for sourceAction with name 'CodeStarConnectionsSourceAction'/);
  });

  test('empty pushFilter for trigger is set to undefined', () => {
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      triggers: [{
        providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
        gitConfiguration: {
          sourceAction,
          pushFilter: [],
        },
      }],
    });

    testPipelineSetup(pipeline, [sourceAction], [buildAction]);

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      PipelineType: 'V2',
      Triggers: [{
        GitConfiguration: {
          SourceActionName: 'CodeStarConnectionsSourceAction',
          Push: Match.absent(),
        },
        ProviderType: 'CodeStarSourceConnection',
      }],
    });
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
                tagsExcludes: ['exclude1'],
                tagsIncludes: ['include1'],
              },
              {
                tagsExcludes: ['exclude2'],
                tagsIncludes: ['include2'],
              },
              {
                tagsExcludes: ['exclude3'],
                tagsIncludes: ['include3'],
              },
              {
                tagsExcludes: ['exclude4'],
                tagsIncludes: ['include4'],
              },
            ],
          },
        }],
      });
    }).toThrow(/length of pushFilter for sourceAction with name 'CodeStarConnectionsSourceAction' must be less than or equal to 3, got 4/);;
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
              tagsExcludes: ['exclude1', 'exclude2'],
              tagsIncludes: ['include1', 'include2'],
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
            tagsExcludes: ['exclude1', 'exclude2'],
            tagsIncludes: ['include1', 'include2'],
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
            tagsExcludes: ['exclude1', 'exclude2'],
            tagsIncludes: ['include1', 'include2'],
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
          tagsExcludes: ['exclude1', 'exclude2'],
          tagsIncludes: ['include1', 'include2'],
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