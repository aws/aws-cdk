// import { validateArtifactBounds, validateSourceAction } from '../lib/validation';
import actions = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');

// tslint:disable:object-literal-key-quotes

class TestAction extends actions.Action {}

export = {
  'artifact bounds validation': {

    'artifacts count exceed maximum'(test: Test) {
      const result = boundsValidationResult(1, 0, 0);
      test.deepEqual(result.length, 1);
      test.ok(result[0].match(/cannot have more than 0/), 'the validation should have failed');
      test.done();
    },

    'artifacts count below minimum'(test: Test) {
      const result = boundsValidationResult(1, 2, 2);
      test.deepEqual(result.length, 1);
      test.ok(result[0].match(/must have at least 2/), 'the validation should have failed');
      test.done();
    },

    'artifacts count within bounds'(test: Test) {
      const result = boundsValidationResult(1, 0, 2);
      test.deepEqual(result.length, 0);
      test.done();
    },
  },

  'action type validation': {

    'must be source and is source'(test: Test) {
      const result = actions.validateSourceAction(true, actions.ActionCategory.Source, 'test action', 'test stage');
      test.deepEqual(result.length, 0);
      test.done();
    },

    'must be source and is not source'(test: Test) {
      const result = actions.validateSourceAction(true, actions.ActionCategory.Deploy, 'test action', 'test stage');
      test.deepEqual(result.length, 1);
      test.ok(result[0].match(/may only contain Source actions/), 'the validation should have failed');
      test.done();
    },

    'cannot be source and is source'(test: Test) {
      const result = actions.validateSourceAction(false, actions.ActionCategory.Source, 'test action', 'test stage');
      test.deepEqual(result.length, 1);
      test.ok(result[0].match(/may only occur in first stage/), 'the validation should have failed');
      test.done();
    },

    'cannot be source and is not source'(test: Test) {
      const result = actions.validateSourceAction(false, actions.ActionCategory.Deploy, 'test action', 'test stage');
      test.deepEqual(result.length, 0);
      test.done();
    },
  },

  'standard action with artifacts'(test: Test) {
    const stack = new cdk.Stack();
    const pipeline = new codepipeline.Pipeline(stack, 'pipeline');
    const stage = new codepipeline.Stage(stack, 'stage', { pipeline });
    const action = new TestAction(stack, 'TestAction', {
      stage,
      artifactBounds: actions.defaultBounds(),
      category: actions.ActionCategory.Source,
      provider: 'test provider',
      configuration: { blah: 'bleep' }
    });
    new actions.Artifact(action, 'TestOutput');

    test.deepEqual((stage.render().actions as any)[0], {
      name: 'TestAction',
      inputArtifacts: [],
      actionTypeId:
        {
          category: 'Source',
          version: '1',
          owner: 'AWS',
          provider: 'test provider'
        },
      configuration: { blah: 'bleep' },
      outputArtifacts: [{ name: 'TestOutput' }],
      runOrder: 1
    });
    test.done();
  }
};

function boundsValidationResult(numberOfArtifacts: number, min: number, max: number): string[] {
  const stack = new cdk.Stack();
  const pipeline = new codepipeline.Pipeline(stack, 'pipeline');
  const stage = new codepipeline.Stage(stack, 'stage', { pipeline });
  const action = new TestAction(stack, 'TestAction', {
    stage,
    artifactBounds: actions.defaultBounds(),
    category: actions.ActionCategory.Test,
    provider: 'test provider'
  });
  const artifacts: actions.Artifact[] = [];
  for (let i = 0; i < numberOfArtifacts; i++) {
    artifacts.push(new actions.Artifact(action, `TestArtifact${i}`));
  }
  return actions.validateArtifactBounds('output', artifacts, min, max, 'testCategory', 'testProvider');
}
