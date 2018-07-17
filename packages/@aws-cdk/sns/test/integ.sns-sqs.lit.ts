import { App, Stack, StackProps } from '@aws-cdk/cdk';
import { Queue } from '@aws-cdk/sqs';
import { Topic } from '../lib';

class SnsToSqs extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        /// !show
        const topic = new Topic(this, 'MyTopic');
        const queue = new Queue(this, 'MyQueue');

        topic.subscribeQueue(queue);
        /// !hide
    }
}

const app = new App(process.argv);

new SnsToSqs(app, 'aws-cdk-sns-sqs');

process.stdout.write(app.run());
