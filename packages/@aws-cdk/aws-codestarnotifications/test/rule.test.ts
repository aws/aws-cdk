import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as notifications from '../lib';
import {
  FakeCodeBuild,
  FakeCodePipeline,
  FakeIncorrectResource,
  FakeSlackTarget,
  FakeSnsTopicTarget,
} from './helpers';

describe('Rule', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('created new notification rule with source', () => {
    const project = new FakeCodeBuild();
    new notifications.Rule(stack, 'MyNotificationRule', {
      source: project,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
    });
  });

  test('created new notification rule with all parameters in constructor props', () => {
    const project = new FakeCodeBuild();
    const topic = new FakeSnsTopicTarget();
    const slack = new FakeSlackTarget();

    new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
      detailType: notifications.DetailType.FULL,
      events: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
      ],
      source: project,
      targets: [
        topic,
        slack,
      ],
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
      ],
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      Targets: [
        {
          TargetAddress: 'arn:aws:sns::1234567890:MyTopic',
          TargetType: 'SNS',
        },
        {
          TargetAddress: 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/MySlackChannel',
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });

  test('created new notification rule without name and will generate from the `id`', () => {
    new notifications.Rule(stack, 'MyNotificationRuleGeneratedFromId', {
      source: new FakeCodeBuild(),
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'MyNotificationRuleGeneratedFromId',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
    });
  });

  test('generating name will cut if id length is over than 64 charts', () => {
    const project = new FakeCodeBuild();

    new notifications.Rule(stack, 'MyNotificationRuleGeneratedFromIdIsToooooooooooooooooooooooooooooLong', {
      source: project,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'MyNotificationRuleGeneratedFromIdIsTooooooooooooooooooooooooooo',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
    });
  });

  test('created new notification rule without detailType', () => {
    const project = new FakeCodeBuild();

    new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
      source: project,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
    });
  });

  test('created new notification rule with status DISABLED', () => {
    const project = new FakeCodeBuild();

    new notifications.Rule(stack, 'MyNotificationRule', {
      source: project,
      status: notifications.Status.DISABLED,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      Status: 'DISABLED',
    });
  });

  test('created new notification rule with projectArn inside object', () => {
    new notifications.Rule(stack, 'MyNotificationRule', {
      source: {
        projectArn: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      },
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
    });
  });

  test('created new notification rule with pipelineArn inside object', () => {
    new notifications.Rule(stack, 'MyNotificationRule', {
      source: {
        pipelineArn: 'arn:aws:codepipeline::1234567890:MyCodepipelineProject',
      },
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Resource: 'arn:aws:codepipeline::1234567890:MyCodepipelineProject',
    });
  });

  test('notification added targets', () => {
    const project = new FakeCodeBuild();
    const topic1: notifications.IRuleTarget = {
      bind: () => ({
        targetType: notifications.TargetType.SNS,
        targetAddress: 'arn:aws:sns::1234567890:MyTopic1',
      }),
    };
    const topic2: notifications.IRuleTarget = {
      bind: () => ({
        targetType: notifications.TargetType.SNS,
        targetAddress: 'arn:aws:sns::1234567890:MyTopic2',
      }),
    };
    const slack = new FakeSlackTarget();

    const rule = new notifications.Rule(stack, 'MyNotificationRule', {
      source: project,
    });

    rule.addTarget(topic1);
    rule.addTarget(topic2);
    rule.addTarget(slack);

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Resource: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
      Targets: [
        {
          TargetAddress: 'arn:aws:sns::1234567890:MyTopic1',
          TargetType: 'SNS',
        },
        {
          TargetAddress: 'arn:aws:sns::1234567890:MyTopic2',
          TargetType: 'SNS',
        },
        {
          TargetAddress: 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/MySlackChannel',
          TargetType: 'AWSChatbotSlack',
        },
      ],
    });
  });

  test('notification added events', () => {
    const pipeline = new FakeCodePipeline();
    const rule = new notifications.Rule(stack, 'MyNotificationRule', {
      source: pipeline,
    });

    rule.addEvents(['codepipeline-pipeline-pipeline-execution-succeeded']);

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Resource: 'arn:aws:codepipeline::1234567890:MyCodepipelineProject',
      EventTypeIds: ['codepipeline-pipeline-pipeline-execution-succeeded'],
    });
  });

  test('will nothing to do if notification added duplicating event', () => {
    const pipeline = new FakeCodePipeline();
    const rule = new notifications.Rule(stack, 'MyNotificationRule', {
      source: pipeline,
    });

    rule.addEvents(['codepipeline-pipeline-pipeline-execution-succeeded']);
    rule.addEvents(['codepipeline-pipeline-pipeline-execution-succeeded']);

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      Resource: 'arn:aws:codepipeline::1234567890:MyCodepipelineProject',
      EventTypeIds: ['codepipeline-pipeline-pipeline-execution-succeeded'],
    });
  });

  test('should throw error if specify multiple sources', () => {
    const project = new FakeCodeBuild();
    const pipeline = new FakeCodePipeline();
    const topic = new FakeSnsTopicTarget();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
      events: [
        'codebuild-project-build-state-succeeded',
        'codepipeline-pipeline-pipeline-execution-succeeded',
      ],
      source: {
        projectArn: project.projectArn,
        pipelineArn: pipeline.pipelineArn,
      },
      targets: [
        topic,
      ],
    })).toThrow(
      /only one source can be specified/,
    );
  });

  test('should throw error if source events are invalid with source CodeBuild project when add events', () => {
    const project = new FakeCodeBuild();
    const rule = new notifications.Rule(stack, 'MyNotificationRule', {
      source: project,
    });

    expect(() => rule.addEvents(['codepipeline-pipeline-pipeline-execution-succeeded'])).toThrow(
      /codepipeline-pipeline-pipeline-execution-succeeded event id is not valid in CodeBuild/,
    );
  });

  test('should throw error if source events are invalid with CodePipeline pipeline when add events', () => {
    const pipeline = new FakeCodePipeline();
    const rule = new notifications.Rule(stack, 'MyNotificationRule', {
      source: pipeline,
    });

    expect(() => rule.addEvents(['codebuild-project-build-state-succeeded'])).toThrow(
      /codebuild-project-build-state-succeeded event id is not valid in CodePipeline/,
    );
  });

  test('should throws error if source is invalid', () => {
    const someResource = new FakeIncorrectResource();

    expect(() => new notifications.Rule(stack, 'MyNotificationRule', {
      // @ts-ignore
      source: someResource,
    })).toThrowError('"source" property must have "projectArn" or "pipelineArn"');
  });

  test('from notification rule ARN', () => {
    const imported = notifications.Rule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
    expect(imported.ruleArn).toEqual('arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
  });
});