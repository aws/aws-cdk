import { Template } from '@aws-cdk/assertions';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as codecommit from '../lib';

describe('notification rule', () => {
  test('CodeCommit Repositories - can create notification rule', () => {
    const stack = new cdk.Stack();
    const repository = new codecommit.Repository(stack, 'MyCodecommitRepository', {
      repositoryName: 'my-test-repository',
    });

    const target = new sns.Topic(stack, 'MyTopic');

    repository.notifyOnPullRequestCreated('NotifyOnPullRequestCreated', target);

    repository.notifyOnPullRequestMerged('NotifyOnPullRequestMerged', target);

    Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'MyCodecommitRepositoryNotifyOnPullRequestCreatedBB14EA32',
      DetailType: 'FULL',
      EventTypeIds: [
        'codecommit-repository-pull-request-created',
      ],
      Resource: {
        'Fn::GetAtt': [
          'MyCodecommitRepository26DB372B',
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
      Name: 'MyCodecommitRepositoryNotifyOnPullRequestMerged34A7EDF1',
      DetailType: 'FULL',
      EventTypeIds: [
        'codecommit-repository-pull-request-merged',
      ],
      Resource: {
        'Fn::GetAtt': [
          'MyCodecommitRepository26DB372B',
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