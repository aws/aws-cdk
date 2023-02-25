#!/usr/bin/env node
import * as sns from '../../aws-sns';
import * as cdk from '../../core';
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