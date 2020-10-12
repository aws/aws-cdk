import * as codebuild from '@aws-cdk/aws-codebuild';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { CodeBuildProject } from '../lib';
import { FakeSnsTopicTarget } from './helpers';
import '@aws-cdk/assert/jest';

describe('CodeBuildProject Source', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('notification source from codebuild', () => {
    const project = new codebuild.Project(stack, 'MyCodebuildProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'echo "Hello, CodeBuild!"',
            ],
          },
        },
      }),
    });
    const codeBuildSource = new CodeBuildProject(project);

    const topic = new sns.Topic(stack, 'MyTopic');
    const dummyTarget = new FakeSnsTopicTarget(topic);

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
      ],
      source: codeBuildSource,
      targets: [
        dummyTarget,
      ],
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
      ],
      Name: 'MyNotificationRule',
      Resource: {
        'Fn::GetAtt': [
          'MyCodebuildProjectB0479580',
          'Arn',
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