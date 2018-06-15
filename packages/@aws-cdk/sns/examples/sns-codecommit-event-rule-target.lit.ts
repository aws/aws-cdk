import { Repository } from '@aws-cdk/codecommit';
import { App, Stack, StackProps } from "@aws-cdk/core";
import { EventRule } from "@aws-cdk/events";
import { Topic } from "../lib";

class IntegStack extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const codeCommitRepo = new Repository(this, 'Repo', {
            repositoryName: 'TestRepo'
        });

        /// !show
        const myTopic = new Topic(this, 'MyTopic');

        // Use an EventRule and add the topic as a target
        const rule = new EventRule(this, 'Rule', {
            scheduleExpression: 'rate(1 minute)'
        });
        rule.addTarget(myTopic);

        // Or use one of the onXxx methods on event sources
        codeCommitRepo.onCommit('OnCommit', myTopic);

        /// !hide
    }
}

const app = new App(process.argv);
new IntegStack(app, 'aws-cdk-sns-event-target');
process.stdout.write(app.run());