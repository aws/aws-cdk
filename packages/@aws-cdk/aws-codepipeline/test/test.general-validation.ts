import actions = require('@aws-cdk/aws-codepipeline-api');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { Pipeline } from '../lib/pipeline';
import { Stage } from '../lib/stage';

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
      const validationBlock = () => { actions.validateName('test thing', name); };
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

      test.deepEqual(stage.validate().length, 1);

      test.done();
    }
  },

  'Pipeline validation': {
    'should fail if Pipeline has no Stages'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new Pipeline(stack, 'Pipeline');

      test.deepEqual(pipeline.validate().length, 1);

      test.done();
    },

    'should fail if Pipeline has a Source Action in a non-first Stage'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new Pipeline(stack, 'Pipeline');
      const firstStage = new Stage(stack, 'FirstStage', { pipeline });
      const secondStage = new Stage(stack, 'SecondStage', { pipeline });

      const bucket = new s3.Bucket(stack, 'PipelineBucket');
      new s3.PipelineSourceAction(stack, 'FirstAction', {
        stage: firstStage,
        artifactName: 'FirstArtifact',
        bucket,
        bucketKey: 'key',
      });
      new s3.PipelineSourceAction(stack, 'SecondAction', {
        stage: secondStage,
        artifactName: 'SecondAction',
        bucket,
        bucketKey: 'key',
      });

      test.deepEqual(pipeline.validate().length, 1);

      test.done();
    }
  }
};

function stageForTesting(): Stage {
  const stack = new cdk.Stack();
  const pipeline = new Pipeline(stack, 'pipeline');
  return new Stage(stack, 'stage', { pipeline });
}
