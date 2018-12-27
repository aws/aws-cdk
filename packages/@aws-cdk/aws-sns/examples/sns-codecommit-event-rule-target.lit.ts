import codecommit = require('@aws-cdk/aws-codecommit');
import events = require('@aws-cdk/aws-events');
import cdk = require('@aws-cdk/cdk');
import { Topic } from '../lib';

class IntegStack extends cdk.Stack {
  constructor(scope: cdk.App, scid: string, props?: cdk.StackProps) {
    super(scope, scid, props);

    const codeCommitRepo = new codecommit.Repository(this, 'Repo', {
      repositoryName: 'TestRepo'
    });

    /// !show
    const myTopic = new Topic(this, 'MyTopic');

    // Use an EventRule and add the topic as a target
    const rule = new events.EventRule(this, 'Rule', {
      scheduleExpression: 'rate(1 minute)'
    });
    rule.addTarget(myTopic);

    // Or use one of the onXxx methods on event sources
    codeCommitRepo.onCommit('OnCommit', myTopic);

    /// !hide
  }
}

const app = new cdk.App();
new IntegStack(app, 'aws-cdk-sns-event-target');
app.run();
