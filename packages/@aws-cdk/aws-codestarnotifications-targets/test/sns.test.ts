import '@aws-cdk/assert-internal/jest';
// import * as codebuild from '@aws-cdk/aws-codebuild';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as targets from '../lib';
import { FakeCodeBuild } from './helpers';

describe('SnsTopicNotificationTarget', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('notification target to sns', () => {
    const project = new FakeCodeBuild();
    // const project = new codebuild.Project(stack, 'MyCodebuildProject', {
    //   buildSpec: codebuild.BuildSpec.fromObject({
    //     version: '0.2',
    //     phases: {
    //       build: {
    //         commands: [
    //           'echo "Hello, CodeBuild!"',
    //         ],
    //       },
    //     },
    //   }),
    // });

    const topic = new sns.Topic(stack, 'MyTopic', {});

    new notifications.Rule(stack, 'MyNotificationRule', {
      ruleName: 'MyNotificationRule',
      events: [
        notifications.Event.PROJECT_BUILD_STATE_SUCCEEDED,
        notifications.Event.PROJECT_BUILD_STATE_FAILED,
      ],
      targets: [
        new targets.SnsTopic(topic),
      ],
      source: project,
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
      ],
      Name: 'MyNotificationRule',
      Resource: 'arn:aws:codebuild::123456789000:project/MyCodebuildProject',
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