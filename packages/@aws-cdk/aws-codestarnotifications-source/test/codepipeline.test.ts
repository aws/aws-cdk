import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { CodePipelineProject } from '../lib';
import { FakeSnsTopicTarget, FakeSourceAction, FakeBuildAction } from './helpers';
import '@aws-cdk/assert/jest';

describe('CodePipelineProject Source', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('notification source from codepipeline', () => {
    const sourceOutput = new codepipeline.Artifact();
    const pipeline = new codepipeline.Pipeline(stack, 'MyCodePipelineProject', {
      stages: [
        {
          stageName: 'Source',
          actions: [new FakeSourceAction({
            actionName: 'Source',
            output: sourceOutput,
          })],
        },
        {
          stageName: 'Build',
          actions: [new FakeBuildAction({
            actionName: 'Build',
            input: sourceOutput,
          })],
        },
      ],
    });
    const codePipelineSource = new CodePipelineProject(pipeline);

    const topic = new sns.Topic(stack, 'MyTopic');
    const dummyTarget = new FakeSnsTopicTarget(topic);

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.PipelineEvent.PIPELINE_EXECUTION_SUCCEEDED,
      ],
      source: codePipelineSource,
      targets: [
        dummyTarget,
      ],
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codepipeline-pipeline-pipeline-execution-succeeded',
      ],
      Name: 'MyNotificationRule',
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
              Ref: 'MyCodePipelineProjectAC7FF8DB',
            },
          ],
        ],
      },
      Targets: [
        {
          TargetAddress: {
            Ref: 'MyTopic86869434',
          },
          TargetType: 'SNS',
        },
      ],
    });
  });
});