import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as codepipeline from '../lib';
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';

// tslint:disable:object-literal-key-quotes

export = {
  'Artifacts in CodePipeline': {
    'cannot be created with an empty name'(test: Test) {
      test.throws(() => new codepipeline.Artifact(''), /Artifact name must match regular expression/);

      test.done();
    },

    'without a name, when used as an input without being used as an output first - should fail validation'(test: Test) {
      const stack = new cdk.Stack();
      const sourceOutput = new codepipeline.Artifact();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new FakeBuildAction({
                actionName: 'Build',
                input: new codepipeline.Artifact(),
              }),
            ],
          },
        ],
      });

      const errors = validate(stack);

      test.equal(errors.length, 1);
      const error = errors[0];
      test.same(error.source, pipeline);
      test.equal(error.message, "Action 'Build' has an unnamed input Artifact (probably not used as an output in this pipeline)");

      test.done();
    },

    'with a name, when used as an input without being used as an output first - should fail validation'(test: Test) {
      const stack = new cdk.Stack();
      const sourceOutput = new codepipeline.Artifact();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new FakeBuildAction({
                actionName: 'Build',
                input: new codepipeline.Artifact('named'),
              }),
            ],
          },
        ],
      });

      const errors = validate(stack);

      test.equal(errors.length, 1);
      const error = errors[0];
      test.same(error.source, pipeline);
      test.equal(error.message, "Artifact 'named' is used as an input by 'Build', but is not being produced in this pipeline");

      test.done();
    },

    'without a name, when used as an output multiple times - should fail validation'(test: Test) {
      const stack = new cdk.Stack();
      const sourceOutput = new codepipeline.Artifact();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new FakeBuildAction({
                actionName: 'Build',
                input: sourceOutput,
                output: sourceOutput,
              }),
            ],
          },
        ],
      });

      const errors = validate(stack);

      test.equal(errors.length, 1);
      const error = errors[0];
      test.same(error.source, pipeline);
      test.equal(error.message, "Artifact 'Artifact_Source_Source' is used as an output by both 'Source' and 'Build'. Every artifact can only be produced once.");

      test.done();
    },

    "an Action's output can be used as input for an Action in the same Stage with a higher runOrder"(test: Test) {
      const stack = new cdk.Stack();

      const sourceOutput1 = new codepipeline.Artifact('sourceOutput1');
      const buildOutput1 = new codepipeline.Artifact('buildOutput1');
      const sourceOutput2 = new codepipeline.Artifact('sourceOutput2');

      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new FakeSourceAction({
                actionName: 'source1',
                output: sourceOutput1,
              }),
              new FakeSourceAction({
                actionName: 'source2',
                output: sourceOutput2,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new FakeBuildAction({
                actionName: 'build1',
                input: sourceOutput1,
                output: buildOutput1,
              }),
              new FakeBuildAction({
                actionName: 'build2',
                input: sourceOutput2,
                extraInputs: [buildOutput1],
                output: new codepipeline.Artifact('buildOutput2'),
                runOrder: 2,
              }),
            ],
          },
        ],
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        //
      }));

      test.done();
    },

    'violation of runOrder constraints is detected and reported'(test: Test) {
      const stack = new cdk.Stack();

      const sourceOutput1 = new codepipeline.Artifact('sourceOutput1');
      const buildOutput1 = new codepipeline.Artifact('buildOutput1');
      const sourceOutput2 = new codepipeline.Artifact('sourceOutput2');

      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new FakeSourceAction({
                actionName: 'source1',
                output: sourceOutput1,
              }),
              new FakeSourceAction({
                actionName: 'source2',
                output: sourceOutput2,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new FakeBuildAction({
                actionName: 'build1',
                input: sourceOutput1,
                output: buildOutput1,
                runOrder: 3,
              }),
              new FakeBuildAction({
                actionName: 'build2',
                input: sourceOutput2,
                extraInputs: [buildOutput1],
                output: new codepipeline.Artifact('buildOutput2'),
                runOrder: 2,
              }),
            ],
          },
        ],
      });

      const errors = validate(stack);

      test.equal(errors.length, 1);
      const error = errors[0];
      test.same(error.source, pipeline);
      test.equal(error.message, "Artifact 'buildOutput1' is being produced at stage 2 ('Build') action 3 ('build1') but first consumed before that, at stage 2 ('Build') action 2 ('build2')");

      test.done();
    },

    'without a name, sanitize the auto stage-action derived name'(test: Test) {
      const stack = new cdk.Stack();

      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source.@', // @ and . are not allowed in Artifact names!
            actions: [
              new FakeSourceAction({
                actionName: 'source1',
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new FakeBuildAction({
                actionName: 'build1',
                input: sourceOutput,
              }),
            ],
          },
        ],
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source.@',
            'Actions': [
              {
                'Name': 'source1',
                'OutputArtifacts': [
                  { 'Name': 'Artifact_Source_source1' },
                ],
              },
            ],
          },
          {
            'Name': 'Build',
            'Actions': [
              {
                'Name': 'build1',
                'InputArtifacts': [
                  { 'Name': 'Artifact_Source_source1' },
                ],
              },
            ],
          },
        ],
      }));

      test.done();
    },
  },
};

function validate(construct: cdk.IConstruct): cdk.ValidationError[] {
  cdk.ConstructNode.prepare(construct.node);
  return cdk.ConstructNode.validate(construct.node);
}
