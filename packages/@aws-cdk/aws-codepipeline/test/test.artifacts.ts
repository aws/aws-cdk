// import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');
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
            name: 'Source',
            actions: [
              new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              }),
            ],
          },
          {
            name: 'Build',
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
            name: 'Source',
            actions: [
              new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              }),
            ],
          },
          {
            name: 'Build',
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
            name: 'Source',
            actions: [
              new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              }),
            ],
          },
          {
            name: 'Build',
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
  },
};

function validate(construct: cdk.IConstruct): cdk.ValidationError[] {
  construct.node.prepareTree();
  return construct.node.validateTree();
}
