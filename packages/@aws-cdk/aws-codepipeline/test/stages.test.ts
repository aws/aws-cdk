import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as codepipeline from '../lib';
import { Stage } from '../lib/private/stage';

/* eslint-disable quote-props */

nodeunitShim({
  'Pipeline Stages': {
    'can be inserted before another Stage'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

      const secondStage = pipeline.addStage({ stageName: 'SecondStage' });
      pipeline.addStage({
        stageName: 'FirstStage',
        placement: {
          rightBefore: secondStage,
        },
      });

      expect(stack, true).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          { 'Name': 'FirstStage' },
          { 'Name': 'SecondStage' },
        ],
      }));

      test.done();
    },

    'can be inserted after another Stage'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

      const firstStage = pipeline.addStage({ stageName: 'FirstStage' });
      pipeline.addStage({ stageName: 'ThirdStage' });
      pipeline.addStage({
        stageName: 'SecondStage',
        placement: {
          justAfter: firstStage,
        },
      });

      expect(stack, true).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          { 'Name': 'FirstStage' },
          { 'Name': 'SecondStage' },
          { 'Name': 'ThirdStage' },
        ],
      }));

      test.done();
    },

    "attempting to insert a Stage before a Stage that doesn't exist results in an error"(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
      const stage = pipeline.addStage({ stageName: 'Stage' });

      const anotherPipeline = new codepipeline.Pipeline(stack, 'AnotherPipeline');
      test.throws(() => {
        anotherPipeline.addStage({
          stageName: 'AnotherStage',
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
      const stage = pipeline.addStage({ stageName: 'Stage' });

      const anotherPipeline = new codepipeline.Pipeline(stack, 'AnotherPipeline');
      test.throws(() => {
        anotherPipeline.addStage({
          stageName: 'AnotherStage',
          placement: {
            justAfter: stage,
          },
        });
      }, /after/i);

      test.done();
    },

    'providing more than one placement value results in an error'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
      const stage = pipeline.addStage({ stageName: 'Stage' });

      test.throws(() => {
        pipeline.addStage({
          stageName: 'SecondStage',
          placement: {
            rightBefore: stage,
            justAfter: stage,
          },
        });
      // incredibly, an arrow function below causes nodeunit to crap out with:
      // "TypeError: Function has non-object prototype 'undefined' in instanceof check"
      }, /(rightBefore.*justAfter)|(justAfter.*rightBefore)/);

      test.done();
    },

    'can be retrieved from a pipeline after it has been created'(test: Test) {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'FirstStage',
          },
        ],
      });

      pipeline.addStage({ stageName: 'SecondStage' });

      test.equal(pipeline.stages.length, 2);
      test.equal(pipeline.stages[0].stageName, 'FirstStage');
      test.equal(pipeline.stages[1].stageName, 'SecondStage');

      // adding stages to the returned array should have no effect
      pipeline.stages.push(new Stage({
        stageName: 'ThirdStage',
      }, pipeline));
      test.equal(pipeline.stageCount, 2);

      test.done();
    },
  },
});
