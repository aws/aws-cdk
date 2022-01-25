import { Template, Match } from '@aws-cdk/assertions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import { Lazy, Stack } from '@aws-cdk/core';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

describe('S3 source Action', () => {
  describe('S3 Source Action', () => {
    test('by default polls for source changes and does not use Events', () => {
      const stack = new Stack();

      minimalPipeline(stack, undefined);

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
        'Stages': [
          {
            'Actions': [
              {
                'Configuration': {
                },
              },
            ],
          },
          {},
        ],
      }));

      Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 0);


    });

    test('does not poll for source changes and uses Events for S3Trigger.EVENTS', () => {
      const stack = new Stack();

      minimalPipeline(stack, { trigger: cpactions.S3Trigger.EVENTS });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
        'Stages': [
          {
            'Actions': Match.arrayWith([
              Match.objectLike({
                'Configuration': {
                  'PollForSourceChanges': false,
                },
              }),
            ]),
          },
          {},
        ],
      }));

      Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 1);


    });

    test('polls for source changes and does not use Events for S3Trigger.POLL', () => {
      const stack = new Stack();

      minimalPipeline(stack, { trigger: cpactions.S3Trigger.POLL });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
        'Stages': [
          {
            'Actions': [
              {
                'Configuration': {
                  'PollForSourceChanges': true,
                },
              },
            ],
          },
          {},
        ],
      }));

      Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 0);


    });

    test('does not poll for source changes and does not use Events for S3Trigger.NONE', () => {
      const stack = new Stack();

      minimalPipeline(stack, { trigger: cpactions.S3Trigger.NONE });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
        'Stages': [
          {
            'Actions': [
              {
                'Configuration': {
                  'PollForSourceChanges': false,
                },
              },
            ],
          },
          {},
        ],
      }));

      Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 0);
    });

    test('does not allow passing an empty string for the bucketKey property', () => {
      const stack = new Stack();

      expect(() => {
        new cpactions.S3SourceAction({
          actionName: 'Source',
          bucket: new s3.Bucket(stack, 'MyBucket'),
          bucketKey: '',
          output: new codepipeline.Artifact(),
        });
      }).toThrow(/Property bucketKey cannot be an empty string/);


    });

    test('allows using the same bucket with events trigger mutliple times with different bucket paths', () => {
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


    });

    test('throws an error if the same bucket and path with trigger = Events are added to the same pipeline twice', () => {
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

      expect(() => {
        sourceStage.addAction(duplicateBucketAndPath);
      }).toThrow(/S3 source action with path 'my\/other\/path' is already present in the pipeline for this source bucket/);
    });

    test('allows using a Token bucketKey with trigger = Events, multiple times', () => {
      const stack = new Stack();

      const bucket = new s3.Bucket(stack, 'MyBucket');
      const sourceStage = minimalPipeline(stack, {
        bucket,
        bucketKey: Lazy.string({ produce: () => 'my-bucket-key1' }),
        trigger: cpactions.S3Trigger.EVENTS,
      });
      sourceStage.addAction(new cpactions.S3SourceAction({
        actionName: 'Source2',
        bucket,
        bucketKey: Lazy.string({ produce: () => 'my-bucket-key2' }),
        trigger: cpactions.S3Trigger.EVENTS,
        output: new codepipeline.Artifact(),
      }));

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
        'Stages': Match.arrayWith([
          Match.objectLike({
            'Actions': [
              {
                'Configuration': {
                  'S3ObjectKey': 'my-bucket-key1',
                },
              },
              {
                'Configuration': {
                  'S3ObjectKey': 'my-bucket-key2',
                },
              },
            ],
          }),
        ]),
      }));
    });

    test('exposes variables for other actions to consume', () => {
      const stack = new Stack();

      const sourceOutput = new codepipeline.Artifact();
      const s3SourceAction = new cpactions.S3SourceAction({
        actionName: 'Source',
        output: sourceOutput,
        bucket: new s3.Bucket(stack, 'Bucket'),
        bucketKey: 'key.zip',
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [s3SourceAction],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'MyProject'),
                input: sourceOutput,
                environmentVariables: {
                  VersionId: { value: s3SourceAction.variables.versionId },
                },
              }),
            ],
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
        'Stages': [
          {
            'Name': 'Source',
          },
          {
            'Name': 'Build',
            'Actions': [
              {
                'Name': 'Build',
                'Configuration': {
                  'EnvironmentVariables': '[{"name":"VersionId","type":"PLAINTEXT","value":"#{Source_Source_NS.VersionId}"}]',
                },
              },
            ],
          },
        ],
      }));
    });
  });
});

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
