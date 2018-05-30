import { App, Stack, StackProps } from 'aws-cdk';
import { Topic } from 'aws-cdk-sns';
import { Queue } from 'aws-cdk-sqs';

class MyStack extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const queue = new Queue(this, 'MyQueue', {
            visibilityTimeoutSec: 300
        });

        const topic = new Topic(this, 'MyTopic');
        topic.subscribeQueue(queue);
    }
}

const app = new App(process.argv);

new MyStack(app, 'MyStack');

process.stdout.write(app.run());
