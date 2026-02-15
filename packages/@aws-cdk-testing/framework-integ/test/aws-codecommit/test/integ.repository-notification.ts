#!/usr/bin/env node
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codecommit');

const repository = new codecommit.Repository(stack, 'MyCodecommitRepository', {
  repositoryName: 'my-test-repository',
});

const target = new sns.Topic(stack, 'MyTopic');

repository.notifyOnPullRequestCreated('NotifyOnPullRequestCreated', target);
repository.notifyOnPullRequestMerged('NotifyOnPullRequestMerged', target);

new IntegTest(app, 'codecommit-notification-test', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-north-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2', 'ap-south-1', 'sa-east-1', 'ca-central-1'],
});
