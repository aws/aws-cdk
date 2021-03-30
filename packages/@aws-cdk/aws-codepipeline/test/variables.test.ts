import { expect, haveResourceLike } from '@aws-cdk/assert-internal';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as codepipeline from '../lib';
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';

/* eslint-disable quote-props */

nodeunitShim({
  'Pipeline Variables': {
    'uses the passed namespace when its passed when constructing the Action'(test: Test) {
      const stack = new cdk.Stack();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new FakeSourceAction({
              actionName: 'Source',
              output: new codepipeline.Artifact(),
              variablesNamespace: 'MyNamespace',
            })],
          },
        ],
      });

      expect(stack, true).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
            'Actions': [
              {
                'Name': 'Source',
                'Namespace': 'MyNamespace',
              },
            ],
          },
        ],
      }));

      test.done();
    },

    'allows using the variable in the configuration of a different action'(test: Test) {
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

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
      }));

      test.done();
    },

    'fails when trying add an action using variables with an empty string for the namespace to a pipeline'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
      const sourceStage = pipeline.addStage({ stageName: 'Source' });

      const sourceAction = new FakeSourceAction({
        actionName: 'Source',
        output: new codepipeline.Artifact(),
        variablesNamespace: '',
      });

      test.throws(() => {
        sourceStage.addAction(sourceAction);
      }, /Namespace name must match regular expression:/);

      test.done();
    },

    'can use global variables'(test: Test) {
      const stack = new cdk.Stack();

      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new FakeBuildAction({
              actionName: 'Build',
              input: new codepipeline.Artifact(),
              customConfigKey: codepipeline.GlobalVariables.executionId,
            })],
          },
        ],
      });

      expect(stack, true).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
            'Actions': [
              {
                'Name': 'Build',
                'Configuration': {
                  'CustomConfigKey': '#{codepipeline.PipelineExecutionId}',
                },
              },
            ],
          },
        ],
      }));

      test.done();
    },
  },
});
