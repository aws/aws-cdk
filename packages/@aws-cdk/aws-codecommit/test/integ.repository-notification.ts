#!/usr/bin/env node
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as codecommit from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codecommit-repository-notification');

const repository = new codecommit.Repository(stack, 'Repository', {
  repositoryName: 'aws-cdk-repository-notification',
});

const target = new sns.Topic(stack, 'MyTopic');

repository.notifyOnPullRequestCreated('NotifyOnPullRequestCreated', target);

app.synth();