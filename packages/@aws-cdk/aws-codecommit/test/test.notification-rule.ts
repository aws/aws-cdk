import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as codecommit from '../lib';

export = {
  'CodeCommit Repositories - can create notification rule'(test: Test) {
    const stack = new cdk.Stack();
    const repository = new codecommit.Repository(stack, 'MyCodecommitRepository', {
      repositoryName: 'my-test-repository',
    });

    const target = new sns.Topic(stack, 'MyTopic');

    repository.notifyOnPullRequestCreated('NotifyOnPullRequestCreated', target);

    repository.notifiyOnPullRequestMerged('NotifyOnPullRequestMerged', target);

    expect(stack).to(haveResource('AWS::CodeStarNotifications::NotificationRule', {
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
    }));

    expect(stack).to(haveResource('AWS::CodeStarNotifications::NotificationRule', {
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
    }));

    test.done();
  },
};