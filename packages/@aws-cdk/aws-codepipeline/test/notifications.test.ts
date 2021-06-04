import '@aws-cdk/assert-internal/jest';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
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

  test('On "Action state change" events emitted notification rule', () => {
    pipeline.notifyOnActionStateChange('NotifyOnActionStateChange', { target: { bind: () => ({ targetType: notifications.TargetType.AWS_CHATBOT_SLACK, targetAddress: 'SlackID' }) } });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'PipelineNotifyOnActionStateChange5148B236',
      DetailType: 'FULL',
      EventTypeIds: [
        'codepipeline-pipeline-action-execution-succeeded',
        'codepipeline-pipeline-action-execution-failed',
        'codepipeline-pipeline-action-execution-canceled',
        'codepipeline-pipeline-action-execution-started',
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

  test('On "Stage execution" events emitted notification rule', () => {
    pipeline.notifyOnStageStateChange('NotifyOnStageStateChange', { target: { bind: () => ({ targetType: notifications.TargetType.AWS_CHATBOT_SLACK, targetAddress: 'SlackID' }) } });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'PipelineNotifyOnStageStateChangeDAED9469',
      DetailType: 'FULL',
      EventTypeIds: [
        'codepipeline-pipeline-stage-execution-started',
        'codepipeline-pipeline-stage-execution-succeeded',
        'codepipeline-pipeline-stage-execution-resumed',
        'codepipeline-pipeline-stage-execution-canceled',
        'codepipeline-pipeline-stage-execution-failed',
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

  test('On "Pipeline execution" events emitted notification rule', () => {
    pipeline.notifyOnPipelineStateChange('NotifyOnPipelineStateChange', { target: { bind: () => ({ targetType: notifications.TargetType.AWS_CHATBOT_SLACK, targetAddress: 'SlackID' }) } });

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

  test('On "Manual approval" events emitted notification rule', () => {
    pipeline.notifyOnApprovalStateChange('NotifyOnApprovalStateChange', { target: { bind: () => ({ targetType: notifications.TargetType.AWS_CHATBOT_SLACK, targetAddress: 'SlackID' }) } });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'PipelineNotifyOnApprovalStateChange919F4E17',
      DetailType: 'FULL',
      EventTypeIds: [
        'codepipeline-pipeline-manual-approval-failed',
        'codepipeline-pipeline-manual-approval-needed',
        'codepipeline-pipeline-manual-approval-succeeded',
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