import { Match, Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';
import * as codepipeline from '../lib';

/* eslint-disable quote-props */

describe('variables', () => {
  describe('Pipeline Variables', () => {
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
});
