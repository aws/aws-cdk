import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as codecommit from '../lib';

export = {
  'notifications rule'(test: Test) {
    const stack = new cdk.Stack();
    const repository = new codecommit.Repository(stack, 'MyRepository', {
      repositoryName: 'my-test-repository',
    });

    const target = new sns.Topic(stack, 'MyTopic');

    repository.notifyOnPullRequestCreated('NotifyOnPullRequestCreated', target);

    repository.notifiyOnPullRequestMerged('NotifyOnPullRequestMerged', target);

    expect(stack).to(haveResource('AWS::CodeStarNotifications::NotificationRule', {
      Name: 'MyRepositoryNotifyOnPullRequestCreated45127895',
      DetailType: 'FULL',
      EventTypeIds: [
        'codecommit-repository-pull-request-created',
      ],
      Resource: {
        'Fn::GetAtt': [
          'MyRepositoryT5458715',
          'Arn',
        ],
      },
      Targets: [
        {
          TargetAddress: {
            Ref: 'MyTopic75489871',
          },
          TargetType: 'SNS',
        },
      ],
    }));

    //  expect(stack).to(haveResource('AWS::CodeStarNotifications::NotificationRule', {
    //    Name: 'MyRepositoryNotifyOnPullRequestMerged47215469',
    //    DetailType: 'FULL',
    //    EventTypeIds: [
    //      'codecommit-repository-pull-request-merged',
    //    ],
    //    Resource: {
    //      'Fn::GetAtt': [
    //        'MyRepositoryT5458715',
    //        'Arn',
    //      ],
    //    },
    //    Targets: [
    //      {
    //        TargetAddress: {
    //          Ref: 'MyTopic75489871',
    //        },
    //        TargetType: 'SNS',
    //      },
    //    ],
    //  }));

    test.done();
  },
};