import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { ConstructNode } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import codepipeline = require('../lib');
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';

/* eslint-disable quote-props */

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
      test.equal(error.message, "Action 'Build' has an unnamed input Artifact that's not used as an output");

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
      test.equal(error.message, "Artifact 'named' was used as input before being used as output");

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
      test.equal(error.message, "Artifact 'Artifact_Source_Source' has been used as an output more than once");

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
  },
};

function validate(construct: cdk.IConstruct): cdk.ValidationError[] {
  ConstructNode.prepare(construct.node);
  return ConstructNode.validate(construct.node);
}
