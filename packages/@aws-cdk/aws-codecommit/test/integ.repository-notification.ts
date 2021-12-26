#!/usr/bin/env node
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as codecommit from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codecommit');

const repository = new codecommit.Repository(stack, 'MyCodecommitRepository', {
  repositoryName: 'my-test-repository',
});

const target = new sns.Topic(stack, 'MyTopic');

repository.notifyOnPullRequestCreated('NotifyOnPullRequestCreated', target);
repository.notifyOnPullRequestMerged('NotifyOnPullRequestMerged', target);

app.synth();