import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codecommit-events');

const repo = new codecommit.Repository(stack, 'Repo', {
  repositoryName: 'aws-cdk-codecommit-events',
});
const topic = new sns.Topic(stack, 'MyTopic');

// we can't use aws-cdk-lib/aws-events-targets.SnsTopic here because it will
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
