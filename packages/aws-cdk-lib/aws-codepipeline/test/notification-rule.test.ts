import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';
import { Template } from '../../assertions';
import * as notifications from '../../aws-codestarnotifications';
import * as cdk from '../../core';
import * as codepipeline from '../lib';

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

  test('On "Pipeline" execution events emitted notification rule', () => {
    const target = {
      bindAsNotificationRuleTarget: () => ({
        targetType: 'AWSChatbotSlack',
        targetAddress: 'SlackID',
      }),
    };

    pipeline.notifyOnExecutionStateChange('NotifyOnExecutionStateChange', target);

    Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'PipelineNotifyOnExecutionStateChange9FE60973',
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
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':codepipeline:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          { Ref: 'PipelineC660917D' },
        ]],
      },
      Targets: [
        {
          TargetAddress: 'SlackID',
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });

  test('On any "Stage" execution events emitted notification rule in pipeline', () => {
    const target = {
      bindAsNotificationRuleTarget: () => ({
        targetType: 'AWSChatbotSlack',
        targetAddress: 'SlackID',
      }),
    };

    pipeline.notifyOnAnyStageStateChange('NotifyOnAnyStageStateChange', target);

    Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'PipelineNotifyOnAnyStageStateChange05355CCD',
      DetailType: 'FULL',
      EventTypeIds: [
        'codepipeline-pipeline-stage-execution-canceled',
        'codepipeline-pipeline-stage-execution-failed',
        'codepipeline-pipeline-stage-execution-resumed',
        'codepipeline-pipeline-stage-execution-started',
        'codepipeline-pipeline-stage-execution-succeeded',
      ],
      Resource: {
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':codepipeline:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          { Ref: 'PipelineC660917D' },
        ]],
      },
      Targets: [
        {
          TargetAddress: 'SlackID',
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });

  test('On any "Action" execution events emitted notification rule in pipeline', () => {
    const target = {
      bindAsNotificationRuleTarget: () => ({
        targetType: 'AWSChatbotSlack',
        targetAddress: 'SlackID',
      }),
    };

    pipeline.notifyOnAnyActionStateChange('NotifyOnAnyActionStateChange', target);

    Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'PipelineNotifyOnAnyActionStateChange64D5B2AA',
      DetailType: 'FULL',
      EventTypeIds: [
        'codepipeline-pipeline-action-execution-canceled',
        'codepipeline-pipeline-action-execution-failed',
        'codepipeline-pipeline-action-execution-started',
        'codepipeline-pipeline-action-execution-succeeded',
      ],
      Resource: {
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':codepipeline:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          { Ref: 'PipelineC660917D' },
        ]],
      },
      Targets: [
        {
          TargetAddress: 'SlackID',
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });

  test('On any "Manual approval" execution events emitted notification rule in pipeline', () => {
    const target = {
      bindAsNotificationRuleTarget: () => ({
        targetType: 'AWSChatbotSlack',
        targetAddress: 'SlackID',
      }),
    };

    pipeline.notifyOnAnyManualApprovalStateChange('NotifyOnAnyManualApprovalStateChange', target);

    Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'PipelineNotifyOnAnyManualApprovalStateChangeE60778F7',
      DetailType: 'FULL',
      EventTypeIds: [
        'codepipeline-pipeline-manual-approval-failed',
        'codepipeline-pipeline-manual-approval-needed',
        'codepipeline-pipeline-manual-approval-succeeded',
      ],
      Resource: {
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':codepipeline:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          { Ref: 'PipelineC660917D' },
        ]],
      },
      Targets: [
        {
          TargetAddress: 'SlackID',
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });

  describe('notifyOn with an existing id', () => {
    const slack = {
      bindAsNotificationRuleTarget: () => ({
        targetType: 'AWSChatbotSlack',
        targetAddress: 'SlackID',
      }),
    };
    const sns = {
      bindAsNotificationRuleTarget: () => ({
        targetType: 'SNS',
        targetAddress: 'TopicArn',
      }),
    };

    test('adds events and targets to the existing notification rule', () => {
      const first = pipeline.notifyOnExecutionStateChange('Notifications', slack);
      const second = pipeline.notifyOnAnyManualApprovalStateChange('Notifications', slack);
      pipeline.notifyOn('Notifications', sns, {
        events: [codepipeline.PipelineNotificationEvents.PIPELINE_EXECUTION_FAILED],
      });

      expect(second).toBe(first);
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::CodeStarNotifications::NotificationRule', 1);
      template.hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
        Name: 'PipelineNotifications15BAB178',
        EventTypeIds: [
          'codepipeline-pipeline-pipeline-execution-failed',
          'codepipeline-pipeline-pipeline-execution-canceled',
          'codepipeline-pipeline-pipeline-execution-started',
          'codepipeline-pipeline-pipeline-execution-resumed',
          'codepipeline-pipeline-pipeline-execution-succeeded',
          'codepipeline-pipeline-pipeline-execution-superseded',
          'codepipeline-pipeline-manual-approval-failed',
          'codepipeline-pipeline-manual-approval-needed',
          'codepipeline-pipeline-manual-approval-succeeded',
        ],
        Targets: [
          { TargetAddress: 'SlackID', TargetType: 'AWSChatbotSlack' },
          { TargetAddress: 'TopicArn', TargetType: 'SNS' },
        ],
      });
    });

    test('different ids still create separate notification rules', () => {
      pipeline.notifyOnExecutionStateChange('ExecutionNotifications', slack);
      pipeline.notifyOnAnyManualApprovalStateChange('ApprovalNotifications', slack);

      Template.fromStack(stack).resourceCountIs('AWS::CodeStarNotifications::NotificationRule', 2);
    });

    test('accepts options that match the defaults', () => {
      pipeline.notifyOnExecutionStateChange('Notifications', slack);
      pipeline.notifyOnAnyStageStateChange('Notifications', slack, {
        enabled: true,
        detailType: notifications.DetailType.FULL,
      });

      Template.fromStack(stack).resourceCountIs('AWS::CodeStarNotifications::NotificationRule', 1);
    });

    test('fails when options differ from the existing notification rule', () => {
      pipeline.notifyOnExecutionStateChange('Notifications', slack);

      expect(() => {
        pipeline.notifyOnAnyStageStateChange('Notifications', slack, {
          detailType: notifications.DetailType.BASIC,
        });
      }).toThrow(/already exists with detailType "FULL", got "BASIC"/);
    });

    test('fails when the id is used by a notification rule for another source', () => {
      const other = new codepipeline.Pipeline(stack, 'OtherPipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new FakeSourceAction({ actionName: 'Fetch', output: new codepipeline.Artifact() })],
          },
          {
            stageName: 'Build',
            actions: [new FakeBuildAction({ actionName: 'Gcc', input: sourceArtifact })],
          },
        ],
      });
      const rule = new notifications.NotificationRule(pipeline, 'Notifications', {
        source: other,
        events: [codepipeline.PipelineNotificationEvents.PIPELINE_EXECUTION_FAILED],
      });

      expect(rule.notificationRuleArn).toBeDefined();
      expect(() => {
        pipeline.notifyOnExecutionStateChange('Notifications', slack);
      }).toThrow(/already exists for a different source/);
    });

    test('fails when the id is used by a construct that is not a notification rule', () => {
      new cdk.CfnResource(pipeline, 'Notifications', { type: 'Test::Resource' });

      expect(() => {
        pipeline.notifyOnExecutionStateChange('Notifications', slack);
      }).toThrow(/There is already a Construct with name 'Notifications'/);
    });
  });
});

