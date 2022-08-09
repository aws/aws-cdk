import { Template } from '@aws-cdk/assertions';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as codebuild from '../lib';

test('notifications rule', () => {
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

  const target = new sns.Topic(stack, 'MyTopic');

  project.notifyOnBuildSucceeded('NotifyOnBuildSucceeded', target);

  project.notifyOnBuildFailed('NotifyOnBuildFailed', target);

  Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
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
        TargetAddress: {
          Ref: 'MyTopic86869434',
        },
        TargetType: 'SNS',
      },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
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
        TargetAddress: {
          Ref: 'MyTopic86869434',
        },
        TargetType: 'SNS',
      },
    ],
  });
});
