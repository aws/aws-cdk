import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'Pipeline Stages': {
    'can be inserted before another Stage'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

      const secondStage = pipeline.addStage({ name: 'SecondStage' });
      pipeline.addStage({
        name: 'FirstStage',
        placement: {
          rightBefore: secondStage,
        },
      });

      expect(stack, true).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        "Stages": [
          { "Name": "FirstStage" },
          { "Name": "SecondStage" },
        ],
      }));

      test.done();
    },

    'can be inserted after another Stage'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

      const firstStage = pipeline.addStage({ name: 'FirstStage' });
      pipeline.addStage({ name: 'ThirdStage' });
      pipeline.addStage({
        name: 'SecondStage',
        placement: {
          justAfter: firstStage,
        },
      });

      expect(stack, true).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        "Stages": [
          { "Name": "FirstStage" },
          { "Name": "SecondStage" },
          { "Name": "ThirdStage" },
        ],
      }));

      test.done();
    },

    "attempting to insert a Stage before a Stage that doesn't exist results in an error"(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
      const stage = pipeline.addStage({ name: 'Stage' });

      const anotherPipeline = new codepipeline.Pipeline(stack, 'AnotherPipeline');
      test.throws(() => {
        anotherPipeline.addStage({
          name: 'AnotherStage',
          placement: {
            rightBefore: stage,
          },
        });
      }, /before/i);

      test.done();
    },

    "attempting to insert a Stage after a Stage that doesn't exist results in an error"(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
      const stage = pipeline.addStage({ name: 'Stage' });

      const anotherPipeline = new codepipeline.Pipeline(stack, 'AnotherPipeline');
      test.throws(() => {
        anotherPipeline.addStage({
          name: 'AnotherStage',
          placement: {
            justAfter: stage,
          },
        });
      }, /after/i);

      test.done();
    },

    "providing more than one placement value results in an error"(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
      const stage = pipeline.addStage({ name: 'Stage' });

      test.throws(() => {
        pipeline.addStage({
          name: 'SecondStage',
          placement: {
            rightBefore: stage,
            justAfter: stage,
          },
        });
      // incredibly, an arrow function below causes nodeunit to crap out with:
      // "TypeError: Function has non-object prototype 'undefined' in instanceof check"
      // tslint:disable-next-line:only-arrow-functions
      }, function(e: any) {
        return /rightBefore/.test(e) && /justAfter/.test(e);
      });

      test.done();
    },
  },
};
