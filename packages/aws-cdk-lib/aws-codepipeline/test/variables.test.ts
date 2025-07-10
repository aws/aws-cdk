import { IConstruct } from 'constructs';
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';
import { Match, Template } from '../../assertions';
import * as cdk from '../../core';
import * as codepipeline from '../lib';

/* eslint-disable quote-props */

describe('variables', () => {
  describe('action-level variables', () => {
    test('uses the passed namespace when its passed when constructing the Action', () => {
      const stack = new cdk.Stack();
      const sourceArtifact = new codepipeline.Artifact();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new FakeSourceAction({
              actionName: 'Source',
              output: sourceArtifact,
              variablesNamespace: 'MyNamespace',
            })],
          },
        ],
      });

      // -- stages and actions here are needed to satisfy validation rules
      const first = pipeline.addStage({ stageName: 'FirstStage' });
      first.addAction(new FakeBuildAction({
        actionName: 'dummyAction',
        input: sourceArtifact,
      }));
      const second = pipeline.addStage({ stageName: 'SecondStage' });
      second.addAction(new FakeBuildAction({
        actionName: 'dummyAction',
        input: sourceArtifact,
      }));
      // --

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'Stages': Match.arrayWith([
          {
            'Name': 'Source',
            'Actions': [
              Match.objectLike({
                'Name': 'Source',
                'Namespace': 'MyNamespace',
              }),
            ],
          },
        ]),
      });
    });

    test('allows using the variable in the configuration of a different action', () => {
      const stack = new cdk.Stack();
      const sourceOutput = new codepipeline.Artifact();
      const fakeSourceAction = new FakeSourceAction({
        actionName: 'Source',
        output: sourceOutput,
        variablesNamespace: 'SourceVariables',
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [fakeSourceAction],
          },
          {
            stageName: 'Build',
            actions: [new FakeBuildAction({
              actionName: 'Build',
              input: sourceOutput,
              customConfigKey: fakeSourceAction.variables.firstVariable,
            })],
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
          },
          {
            'Name': 'Build',
            'Actions': [
              {
                'Name': 'Build',
                'Configuration': {
                  'CustomConfigKey': '#{SourceVariables.FirstVariable}',
                },
              },
            ],
          },
        ],
      });
    });

    test('fails when trying add an action using variables with an empty string for the namespace to a pipeline', () => {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
      const sourceStage = pipeline.addStage({ stageName: 'Source' });

      const sourceAction = new FakeSourceAction({
        actionName: 'Source',
        output: new codepipeline.Artifact(),
        variablesNamespace: '',
      });

      expect(() => {
        sourceStage.addAction(sourceAction);
      }).toThrow(/Namespace name must match regular expression:/);
    });

    test('can use global variables', () => {
      const stack = new cdk.Stack();

      const sourceArtifact = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new FakeSourceAction({
              actionName: 'Source',
              output: sourceArtifact,
            })],
          },
          {
            stageName: 'Build',
            actions: [new FakeBuildAction({
              actionName: 'Build',
              input: sourceArtifact,
              customConfigKey: codepipeline.GlobalVariables.executionId,
            })],
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'Stages': Match.arrayWith([
          {
            'Name': 'Build',
            'Actions': [
              Match.objectLike({
                'Name': 'Build',
                'Configuration': {
                  'CustomConfigKey': '#{codepipeline.PipelineExecutionId}',
                },
              }),
            ],
          },
        ]),
      });
    });
  });

  describe('pipeline-level variables', () => {
    let stack: cdk.Stack;
    let sourceArtifact: codepipeline.Artifact;
    let sourceActions: codepipeline.Action[];
    let buildActions: codepipeline.Action[];
    let variable1: codepipeline.Variable;
    let variable2: codepipeline.Variable;

    beforeEach(() => {
      stack = new cdk.Stack();
      sourceArtifact = new codepipeline.Artifact();
      sourceActions = [new FakeSourceAction({
        actionName: 'FakeSource',
        output: sourceArtifact,
      })];
      buildActions = [new FakeBuildAction({
        actionName: 'FakeBuild',
        input: sourceArtifact,
      })];
      variable1 = new codepipeline.Variable({
        variableName: 'var-name-1',
        description: 'description',
        defaultValue: 'default-value',
      });
      variable2 = new codepipeline.Variable({
        variableName: 'var-name-2',
        description: 'description',
        defaultValue: 'default-value',
      });
    });

    test('can specify pipeline-level variables', () => {
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        variables: [variable1],
      });

      testPipelineSetup(pipeline, sourceActions, buildActions);

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        PipelineType: 'V2',
        Variables: [{
          Name: 'var-name-1',
          Description: 'description',
          DefaultValue: 'default-value',
        }],
      });
    });

    test('can specify pipeline-level multiple variables', () => {
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
        variables: [variable1, variable2],
      });

      testPipelineSetup(pipeline, sourceActions, buildActions);

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        PipelineType: 'V2',
        Variables: [
          {
            Name: 'var-name-1',
            Description: 'description',
            DefaultValue: 'default-value',
          },
          {
            Name: 'var-name-2',
            Description: 'description',
            DefaultValue: 'default-value',
          },
        ],
      });
    });

    test('can specify pipeline-level variables by addVariable method', () => {
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: codepipeline.PipelineType.V2,
      });
      pipeline.addVariable(variable1);

      testPipelineSetup(pipeline, sourceActions, buildActions);

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        PipelineType: 'V2',
        Variables: [{
          Name: 'var-name-1',
          Description: 'description',
          DefaultValue: 'default-value',
        }],
      });
    });

    test('can reference in a format `#{variables.${this.variableName}}`', () => {
      expect(variable1.reference()).toEqual('#{variables.var-name-1}');
    });

    test('validate if pipeline-level variables are specified when pipelineType is not set to V2', () => {
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        variables: [variable1],
      });

      testPipelineSetup(pipeline, sourceActions, buildActions);

      const errors = validate(stack);

      expect(errors.length).toEqual(1);
      const error = errors[0];
      expect(error).toMatch(/Pipeline variables can only be used with V2 pipelines, `PipelineType.V2` must be specified for `pipelineType`/);
    });

    test('validate if pipeline-level variables are specified when pipelineType is not set to V2 and addVariable method is used', () => {
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {});
      pipeline.addVariable(variable1);

      testPipelineSetup(pipeline, sourceActions, buildActions);

      const errors = validate(stack);

      expect(errors.length).toEqual(1);
      const error = errors[0];
      expect(error).toMatch(/Pipeline variables can only be used with V2 pipelines, `PipelineType.V2` must be specified for `pipelineType`/);
    });

    test('throw if name for pipeline-level variable uses invalid character', () => {
      expect(() => {
        new codepipeline.Variable({
          variableName: 'var name',
          description: 'description',
          defaultValue: 'default-value',
        });
      }).toThrow('Variable name must match regular expression: /^[A-Za-z0-9@\\-_]{1,128}$/, got \'var name\'');
    });

    test('throw if length of name for pipeline-level variable is less than 1', () => {
      expect(() => {
        new codepipeline.Variable({
          variableName: '',
          description: 'description',
          defaultValue: 'default-value',
        });
      }).toThrow('Variable name must match regular expression: /^[A-Za-z0-9@\\-_]{1,128}$/, got \'\'');
    });

    test('throw if length of name for pipeline-level variable is greater than 128', () => {
      expect(() => {
        new codepipeline.Variable({
          variableName: 'a'.repeat(129),
          description: 'description',
          defaultValue: 'default-value',
        });
      }).toThrow(`Variable name must match regular expression: /^[A-Za-z0-9@\\-_]{1,128}$/, got '${'a'.repeat(129)}'`);
    });

    test('throw if length of default value for pipeline-level variable is less than 1', () => {
      expect(() => {
        new codepipeline.Variable({
          variableName: 'var-name-1',
          description: 'description',
          defaultValue: '',
        });
      }).toThrow(/Default value for variable 'var-name-1' must be between 1 and 1000 characters long, got 0/);
    });

    test('throw if length of default value for pipeline-level variable is greater than 1000', () => {
      expect(() => {
        new codepipeline.Variable({
          variableName: 'var-name-1',
          description: 'description',
          defaultValue: 'a'.repeat(1001),
        });
      }).toThrow(/Default value for variable 'var-name-1' must be between 1 and 1000 characters long, got 1001/);
    });

    test('throw if length of description for pipeline-level variable is greater than 200', () => {
      expect(() => {
        new codepipeline.Variable({
          variableName: 'var-name-1',
          description: 'a'.repeat(201),
          defaultValue: 'default',
        });
      }).toThrow(/Description for variable 'var-name-1' must not be greater than 200 characters long, got 201/);
    });

    test('throw if variable with duplicate name added to the Pipeline', () => {
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        variables: [variable1],
      });
      const duplicated = new codepipeline.Variable({
        variableName: 'var-name-1',
        description: 'description-dummy',
        defaultValue: 'default-dummy',
      });
      expect(() => {
        pipeline.addVariable(duplicated);
      }).toThrow(/Variable with duplicate name 'var-name-1' added to the Pipeline/);
    });
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
