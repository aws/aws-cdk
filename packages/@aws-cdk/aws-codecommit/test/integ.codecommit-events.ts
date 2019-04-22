import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import codecommit = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codecommit-events');

const repo = new codecommit.Repository(stack, 'Repo', { repositoryName: 'aws-cdk-codecommit-events' });
const topic = new sns.Topic(stack, 'MyTopic');

// we can't use @aws-cdk/aws-events-targets.SnsTopic here because it will
// create a cyclic dependency with codebuild, so we just fake it
repo.onReferenceCreated('OnReferenceCreated', {
  asEventRuleTarget: () => ({
    arn: topic.topicArn,
    id: 'MyTopic'
  })
});

app.run();
