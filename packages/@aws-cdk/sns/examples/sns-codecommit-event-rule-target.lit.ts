import * as cdk from '@aws-cdk/cdk';
import * as codecommit from '@aws-cdk/codecommit';
import * as events from '@aws-cdk/events';
import { Topic } from '../lib';

class IntegStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

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

const app = new cdk.App(process.argv);
new IntegStack(app, 'aws-cdk-sns-event-target');
process.stdout.write(app.run());
