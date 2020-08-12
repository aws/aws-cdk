import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as codecommit from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codecommit-events');

const repo = new codecommit.Repository(stack, 'Repo', {
  repositoryName: 'aws-cdk-codecommit-events',
});
const topic = new sns.Topic(stack, 'MyTopic');

// we can't use @aws-cdk/aws-events-targets.SnsTopic here because it will
// create a cyclic dependency with codebuild, so we just fake it
repo.onReferenceCreated('OnReferenceCreated', {
  target: {
    bind: () => ({
      arn: topic.topicArn,
      id: '',
    }),
  },
});

app.synth();
