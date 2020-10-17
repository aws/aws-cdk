import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { IStage } from '../lib/action';
import { Artifact } from '../lib/artifact';
import { Pipeline } from '../lib/pipeline';
import { validateName } from '../lib/private/validation';
import { FakeSourceAction } from './fake-source-action';

interface NameValidationTestCase {
  name: string;
  shouldPassValidation: boolean;
  explanation: string;
}

nodeunitShim({
  'name validation'(test: Test) {
    const cases: NameValidationTestCase[] = [
      { name: 'BlahBleep123.@-_', shouldPassValidation: true, explanation: 'should be valid' },
      { name: '', shouldPassValidation: false, explanation: 'the empty string should be invalid' },
      { name: ' BlahBleep', shouldPassValidation: false, explanation: 'spaces should be invalid' },
      { name: '!BlahBleep', shouldPassValidation: false, explanation: '\'!\' should be invalid' },
    ];

    cases.forEach(testCase => {
      const name = testCase.name;
      const validationBlock = () => { validateName('test thing', name); };
      if (testCase.shouldPassValidation) {
        test.doesNotThrow(validationBlock, Error, `${name} failed validation but ${testCase.explanation}`);
      } else {
        test.throws(validationBlock, Error, `${name} passed validation but ${testCase.explanation}`);
      }
    });

    test.done();
  },

  'Stage validation': {
    'should fail if Stage has no Actions'(test: Test) {
      const stage = stageForTesting();

      test.deepEqual((stage as any).validate().length, 1);

      test.done();
    },
  },

  'Pipeline validation': {
    'should fail if Pipeline has no Stages'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new Pipeline(stack, 'Pipeline');

      test.deepEqual(cdk.ConstructNode.validate(pipeline.node).length, 1);

      test.done();
    },

    'should fail if Pipeline has a Source Action in a non-first Stage'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new Pipeline(stack, 'Pipeline');

      pipeline.addStage({
        stageName: 'FirstStage',
        actions: [
          new FakeSourceAction({
            actionName: 'FakeSource',
            output: new Artifact(),
          }),
        ],
      });

      test.deepEqual(cdk.ConstructNode.validate(pipeline.node).length, 1);

      test.done();
    },
  },
});

function stageForTesting(): IStage {
  const stack = new cdk.Stack();
  const pipeline = new Pipeline(stack, 'Pipeline');
  return pipeline.addStage({ stageName: 'stage' });
}
