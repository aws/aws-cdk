import { expect, haveResourceLike, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as codepipeline from '../lib';
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';

/* eslint-disable quote-props */

nodeunitShim({
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

      // synthesize - this is where names for artifact without names are allocated
      SynthUtils.synthesize(stack, { skipValidation: true });

      const errors = pipeline.node.validate();

      test.equal(errors.length, 1);
      const error = errors[0];
      test.equal(error, "Action 'Build' is using an unnamed input Artifact, which is not being produced in this pipeline");

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

      const errors = pipeline.node.validate();

      test.equal(errors.length, 1);
      const error = errors[0];
      test.equal(error, "Action 'Build' is using input Artifact 'named', which is not being produced in this pipeline");

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

      SynthUtils.synthesize(stack, { skipValidation: true });

      const errors = pipeline.node.validate();
      test.equal(errors.length, 1);
      const error = errors[0];
      test.equal(error, "Both Actions 'Source' and 'Build' are producting Artifact 'Artifact_Source_Source'. Every artifact can only be produced once.");

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

      const errors = pipeline.node.validate();

      test.equal(errors.length, 1);
      const error = errors[0];
      test.equal(error, "Stage 2 Action 2 ('Build'/'build2') is consuming input Artifact 'buildOutput1' before it is being produced at Stage 2 Action 3 ('Build'/'build1')");

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
});
