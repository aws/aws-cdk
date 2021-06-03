import '@aws-cdk/assert-internal/jest';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as targets from '../lib';

describe('SnsTopicNotificationTarget', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('notification target to sns', () => {
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

    const rule = new notifications.Rule(stack, 'MyNotificationRule', {
      source: project,
    });

    rule.addEvents([
      'codebuild-project-build-state-succeeded',
      'codebuild-project-build-state-failed',
    ]);

    rule.addTarget(new targets.SnsTopic(new sns.Topic(stack, 'MyTopic')));

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
        'codebuild-project-build-state-failed',
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