import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as codebuild from '../lib';

export = {
  'notifications rule'(test: Test) {
    const stack = new cdk.Stack();
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

    project.notifyOnBuildSucceeded('NotifyOnBuildSucceeded', {
      target: {
        bind: () => ({
          targetType: 'AWSChatbotSlack',
          targetAddress: 'SlackID',
        }),
      },
    });

    project.notifyOnBuildFailed('NotifyOnBuildFailed', {
      target: {
        bind: () => ({
          targetType: 'SNS',
          targetAddress: 'TopicID',
        }),
      },
    });

    expect(stack).to(haveResource('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'MyCodebuildProjectNotifyOnBuildSucceeded77719592',
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-succeeded',
      ],
      Resource: {
        'Fn::GetAtt': [
          'MyCodebuildProjectB0479580',
          'Arn',
        ],
      },
      Targets: [
        {
          TargetAddress: 'SlackID',
          TargetType: 'AWSChatbotSlack',
        },
      ],
    }));

    expect(stack).to(haveResource('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'MyCodebuildProjectNotifyOnBuildFailedF680E310',
      DetailType: 'FULL',
      EventTypeIds: [
        'codebuild-project-build-state-failed',
      ],
      Resource: {
        'Fn::GetAtt': [
          'MyCodebuildProjectB0479580',
          'Arn',
        ],
      },
      Targets: [
        {
          TargetAddress: 'TopicID',
          TargetType: 'SNS',
        },
      ],
    }));

    test.done();
  },
};