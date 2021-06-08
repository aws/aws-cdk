import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as codepipeline from '../lib';
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';

describe('pipeline with codestar notification integration', () => {
  let stack: cdk.Stack;
  let pipeline: codepipeline.Pipeline;
  let sourceArtifact: codepipeline.Artifact;
  beforeEach(() => {
    stack = new cdk.Stack();
    sourceArtifact = new codepipeline.Artifact();
    pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [new FakeSourceAction({ actionName: 'Fetch', output: sourceArtifact })],
        },
        {
          stageName: 'Build',
          actions: [new FakeBuildAction({ actionName: 'Gcc', input: sourceArtifact })],
        },
      ],
    });
  });

  test('On "Pipeline execution" events emitted notification rule', () => {
    pipeline.notifyOnStateChange('NotifyOnPipelineStateChange', {
      target: {
        bind: () => ({
          targetType: 'AWSChatbotSlack',
          targetAddress: 'SlackID',
        }),
      },
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'PipelineNotifyOnPipelineStateChange37743E22',
      DetailType: 'FULL',
      EventTypeIds: [
        'codepipeline-pipeline-pipeline-execution-failed',
        'codepipeline-pipeline-pipeline-execution-canceled',
        'codepipeline-pipeline-pipeline-execution-started',
        'codepipeline-pipeline-pipeline-execution-resumed',
        'codepipeline-pipeline-pipeline-execution-succeeded',
        'codepipeline-pipeline-pipeline-execution-superseded',
      ],
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':codepipeline:',
            {
              Ref: 'AWS::Region',
            },
            ':',
            {
              Ref: 'AWS::AccountId',
            },
            ':',
            {
              Ref: 'PipelineC660917D',
            },
          ],
        ],
      },
      Targets: [
        {
          TargetAddress: 'SlackID',
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });
});
