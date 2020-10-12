import * as codecommit from '@aws-cdk/aws-codecommit';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { CodeCommitRepository } from '../lib';
import { FakeSnsTopicTarget } from './helpers';
import '@aws-cdk/assert/jest';

describe('CodeCommitRepository Source', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('notification source from codecommit', () => {
    const repository = new codecommit.Repository(stack, 'MyCodeCommitRepository', {
      repositoryName: 'MyCodeCommitRepository',
    });
    const codeCommitSource = new CodeCommitRepository(repository);

    const topic = new sns.Topic(stack, 'MyTopic');
    const dummyTarget = new FakeSnsTopicTarget(topic);

    new notifications.NotificationRule(stack, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.RepositoryEvent.COMMENTS_ON_COMMITS,
      ],
      source: codeCommitSource,
      targets: [
        dummyTarget,
      ],
    });

    expect(stack).toHaveResourceLike('AWS::CodeStarNotifications::NotificationRule', {
      DetailType: 'FULL',
      EventTypeIds: [
        'codecommit-repository-comments-on-commits',
      ],
      Name: 'MyNotificationRule',
      Resource: {
        'Fn::GetAtt': [
          'MyCodeCommitRepository5884E272',
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
