import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { ActionBind, IStage } from "../lib/action";
import { Pipeline } from '../lib/pipeline';
import { SourceAction, SourceActionProps } from "../lib/source-action";
import { validateName } from "../lib/validation";

interface NameValidationTestCase {
  name: string;
  shouldPassValidation: boolean;
  explanation: string;
}

export = {
  'name validation'(test: Test) {
    const cases: NameValidationTestCase[] = [
      { name: 'BlahBleep123.@-_', shouldPassValidation: true, explanation: 'should be valid' },
      { name: '', shouldPassValidation: false, explanation: 'the empty string should be invalid' },
      { name: ' BlahBleep', shouldPassValidation: false, explanation: 'spaces should be invalid' },
      { name: '!BlahBleep', shouldPassValidation: false, explanation: '\'!\' should be invalid' }
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
    }
  },

  'Pipeline validation': {
    'should fail if Pipeline has no Stages'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new Pipeline(stack, 'Pipeline');

      test.deepEqual(pipeline.node.validateTree().length, 1);

      test.done();
    },

    'should fail if Pipeline has a Source Action in a non-first Stage'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new Pipeline(stack, 'Pipeline');

      pipeline.addStage({
        name: 'FirstStage',
        actions: [
          new FakeSourceAction({
            actionName: 'FakeSource',
            provider: 'Fake',
            outputArtifactName: 'SourceOutput',
          }),
        ],
      });

      test.deepEqual(pipeline.node.validateTree().length, 1);

      test.done();
    }
  }
};

class FakeSourceAction extends SourceAction {
  constructor(props: SourceActionProps) {
    super(props);
  }

  protected bind(_info: ActionBind): void {
    // do nothing
  }
}

function stageForTesting(): IStage {
  const stack = new cdk.Stack();
  const pipeline = new Pipeline(stack, 'Pipeline');
  return pipeline.addStage({ name: 'stage' });
}
