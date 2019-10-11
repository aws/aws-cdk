import { countResources, expect, haveResourceLike, not } from "@aws-cdk/assert";
import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import { Stack } from "@aws-cdk/core";
import { Test } from 'nodeunit';
import cpactions = require('../../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'S3 Source Action': {
    'by default polls for source changes and does not use Events'(test: Test) {
      const stack = new Stack();

      minimalPipeline(stack, undefined);

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        "Stages": [
          {
            "Actions": [
              {
                "Configuration": {
                },
              },
            ],
          },
          {},
        ],
      }));

      expect(stack).to(not(haveResourceLike('AWS::Events::Rule')));

      test.done();
    },

    'does not poll for source changes and uses Events for S3Trigger.EVENTS'(test: Test) {
      const stack = new Stack();

      minimalPipeline(stack, { trigger: cpactions.S3Trigger.EVENTS });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        "Stages": [
          {
            "Actions": [
              {
                "Configuration": {
                  "PollForSourceChanges": false,
                },
              },
            ],
          },
          {},
        ],
      }));

      expect(stack).to(countResources('AWS::Events::Rule', 1));

      test.done();
    },

    'polls for source changes and does not use Events for S3Trigger.POLL'(test: Test) {
      const stack = new Stack();

      minimalPipeline(stack, { trigger: cpactions.S3Trigger.POLL });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        "Stages": [
          {
            "Actions": [
              {
                "Configuration": {
                  "PollForSourceChanges": true,
                },
              },
            ],
          },
          {},
        ],
      }));

      expect(stack).to(not(haveResourceLike('AWS::Events::Rule')));

      test.done();
    },

    'does not poll for source changes and does not use Events for S3Trigger.NONE'(test: Test) {
      const stack = new Stack();

      minimalPipeline(stack, { trigger: cpactions.S3Trigger.NONE });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        "Stages": [
          {
            "Actions": [
              {
                "Configuration": {
                  "PollForSourceChanges": false,
                },
              },
            ],
          },
          {},
        ],
      }));

      expect(stack).to(not(haveResourceLike('AWS::Events::Rule')));

      test.done();
    },

    'does not allow passing an empty string for the bucketKey property'(test: Test) {
      const stack = new Stack();

      test.throws(() => {
        new cpactions.S3SourceAction({
          actionName: 'Source',
          bucket: new s3.Bucket(stack, 'MyBucket'),
          bucketKey: '',
          output: new codepipeline.Artifact(),
        });
      }, /Property bucketKey cannot be an empty string/);

      test.done();
    },

    'allows using the same bucket with events trigger mutliple times with different bucket paths'(test: Test) {
      const stack = new Stack();

      const bucket = new s3.Bucket(stack, 'MyBucket');
      const sourceStage = minimalPipeline(stack, {
        bucket,
        bucketKey: 'my/path',
        trigger: cpactions.S3Trigger.EVENTS,
      });
      sourceStage.addAction(new cpactions.S3SourceAction({
        actionName: 'Source2',
        bucket,
        bucketKey: 'my/other/path',
        trigger: cpactions.S3Trigger.EVENTS,
        output: new codepipeline.Artifact(),
      }));

      test.done();
    },

    'throws an error if the same bucket and path with trigger = Events are added to the same pipeline twice'(test: Test) {
      const stack = new Stack();

      const bucket = new s3.Bucket(stack, 'MyBucket');
      const sourceStage = minimalPipeline(stack, {
        bucket,
        bucketKey: 'my/path',
        trigger: cpactions.S3Trigger.EVENTS,
      });
      sourceStage.addAction(new cpactions.S3SourceAction({
        actionName: 'Source2',
        bucket,
        bucketKey: 'my/other/path',
        trigger: cpactions.S3Trigger.EVENTS,
        output: new codepipeline.Artifact(),
      }));

      const duplicateBucketAndPath = new cpactions.S3SourceAction({
        actionName: 'Source3',
        bucket,
        bucketKey: 'my/other/path',
        trigger: cpactions.S3Trigger.EVENTS,
        output: new codepipeline.Artifact(),
      });

      test.throws(() => {
        sourceStage.addAction(duplicateBucketAndPath);
      }, /S3 source action with path 'my\/other\/path' is already present in the pipeline for this source bucket/);

      test.done();
    },
  },
};

interface MinimalPipelineOptions {
  readonly trigger?: cpactions.S3Trigger;

  readonly bucket?: s3.IBucket;

  readonly bucketKey?: string;
}

function minimalPipeline(stack: Stack, options: MinimalPipelineOptions = {}): codepipeline.IStage {
  const sourceOutput = new codepipeline.Artifact();
  const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline');
  const sourceStage = pipeline.addStage({
    stageName: 'Source',
    actions: [
      new cpactions.S3SourceAction({
        actionName: 'Source',
        bucket: options.bucket || new s3.Bucket(stack, 'MyBucket'),
        bucketKey: options.bucketKey || 'some/path/to',
        output: sourceOutput,
        trigger: options.trigger,
      }),
    ],
  });
  pipeline.addStage({
    stageName: 'Build',
    actions: [
      new cpactions.CodeBuildAction({
        actionName: 'Build',
        project: new codebuild.PipelineProject(stack, 'MyProject'),
        input: sourceOutput,
      }),
    ],
  });
  return sourceStage;
}
