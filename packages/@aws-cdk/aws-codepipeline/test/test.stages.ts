import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'Pipeline Stages': {
    'can be inserted at index 0'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

      new codepipeline.Stage(stack, 'SecondStage', { pipeline });
      new codepipeline.Stage(stack, 'FirstStage', {
        pipeline,
        placement: {
          atIndex: 0,
        },
      });

      expect(stack, true).to(haveResource('AWS::CodePipeline::Pipeline', {
        "Stages": [
          { "Name": "FirstStage" },
          { "Name": "SecondStage" },
        ],
      }));

      test.done();
    },

    'can be inserted before another Stage'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

      const secondStage = pipeline.addStage('SecondStage');
      pipeline.addStage('FirstStage', {
        placement: {
          rightBefore: secondStage,
        },
      });

      expect(stack, true).to(haveResource('AWS::CodePipeline::Pipeline', {
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

      const firstStage = pipeline.addStage('FirstStage');
      pipeline.addStage('ThirdStage');
      pipeline.addStage('SecondStage', {
        placement: {
          justAfter: firstStage,
        },
      });

      expect(stack, true).to(haveResource('AWS::CodePipeline::Pipeline', {
        "Stages": [
          { "Name": "FirstStage" },
          { "Name": "SecondStage" },
          { "Name": "ThirdStage" },
        ],
      }));

      test.done();
    },

    'attempting to insert a Stage at a negative index results in an error'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

      test.throws(() => {
        new codepipeline.Stage(stack, 'Stage', {
          pipeline,
          placement: {
            atIndex: -1,
          },
        });
      }, /atIndex/);

      test.done();
    },

    'attempting to insert a Stage at an index larger than the current number of Stages results in an error'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

      test.throws(() => {
        pipeline.addStage('Stage', {
          placement: {
            atIndex: 1,
          },
        });
      }, /atIndex/);

      test.done();
    },

    "attempting to insert a Stage before a Stage that doesn't exist results in an error"(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
      const stage = pipeline.addStage('Stage');

      const anotherPipeline = new codepipeline.Pipeline(stack, 'AnotherPipeline');
      test.throws(() => {
        anotherPipeline.addStage('AnotherStage', {
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
      const stage = pipeline.addStage('Stage');

      const anotherPipeline = new codepipeline.Pipeline(stack, 'AnotherPipeline');
      test.throws(() => {
        anotherPipeline.addStage('AnotherStage', {
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
      const stage = pipeline.addStage('FirstStage');

      test.throws(() => {
        pipeline.addStage('SecondStage', {
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
