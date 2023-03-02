import * as cdk from '@aws-cdk/core';
import { FakeSourceAction } from './fake-source-action';
import { IStage } from '../lib/action';
import { Artifact } from '../lib/artifact';
import { Pipeline } from '../lib/pipeline';
import { validateName } from '../lib/private/validation';

interface NameValidationTestCase {
  name: string;
  shouldPassValidation: boolean;
  explanation: string;
}

describe('general validation', () => {
  test('name validation', () => {
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
        expect(validationBlock).not.toThrow();
      } else {
        expect(validationBlock).toThrow();
      }
    });
  });

  describe('Stage validation', () => {
    test('should fail if Stage has no Actions', () => {
      const stage = stageForTesting();

      expect((stage as any).validate().length).toEqual(1);
    });
  });

  describe('Pipeline validation', () => {
    test('should fail if Pipeline has no Stages', () => {
      const stack = new cdk.Stack();
      const pipeline = new Pipeline(stack, 'Pipeline');

      expect(pipeline.node.validate().length).toEqual(1);
    });

    test('should fail if Pipeline has a Source Action in a non-first Stage', () => {
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

      expect(pipeline.node.validate().length).toEqual(1);
    });
  });
});

function stageForTesting(): IStage {
  const stack = new cdk.Stack();
  const pipeline = new Pipeline(stack, 'Pipeline');
  return pipeline.addStage({ stageName: 'stage' });
}
