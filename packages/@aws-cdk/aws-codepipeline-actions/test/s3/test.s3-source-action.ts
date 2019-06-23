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

      minimalPipeline(stack, cpactions.S3Trigger.EVENTS);

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

      minimalPipeline(stack, cpactions.S3Trigger.POLL);

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

      minimalPipeline(stack, cpactions.S3Trigger.NONE);

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
  },
};

function minimalPipeline(stack: Stack, trigger: cpactions.S3Trigger | undefined): codepipeline.Pipeline {
  const sourceOutput = new codepipeline.Artifact();
  return new codepipeline.Pipeline(stack, 'MyPipeline', {
    stages: [
      {
        stageName: 'Source',
        actions: [
          new cpactions.S3SourceAction({
            actionName: 'Source',
            bucket: new s3.Bucket(stack, 'MyBucket'),
            bucketKey: 'some/path/to',
            output: sourceOutput,
            trigger,
          }),
        ],
      },
      {
        stageName: 'Build',
        actions: [
          new cpactions.CodeBuildAction({
            actionName: 'Build',
            project: new codebuild.PipelineProject(stack, 'MyProject'),
            input: sourceOutput,
          }),
        ],
      },
    ],
  });
}
