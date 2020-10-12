import * as codedeploy from '@aws-cdk/aws-codedeploy';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { CodeDeployApplication } from '../lib';
import { FakeSnsTopicTarget } from './helpers';
import '@aws-cdk/assert/jest';

describe('CodeDeployApplication Source', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('notification source from codedeploy', () => {
    const application = new codedeploy.LambdaApplication(stack, 'MyApp');

    const codeDeploySource = new CodeDeployApplication(application);

    const topic = new sns.Topic(stack, 'MyTopic');
    const dummyTarget = new FakeSnsTopicTarget(topic);

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.ApplicationEvent.DEPLOYMENT_SUCCEEDED,
      ],
      source: codeDeploySource,
      targets: [
        dummyTarget,
      ],
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codedeploy-application-deployment-succeeded',
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
            ':codedeploy:',
            {
              Ref: 'AWS::Region',
            },
            ':',
            {
              Ref: 'AWS::AccountId',
            },
            ':application:',
            {
              Ref: 'MyApp3CE31C26',
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