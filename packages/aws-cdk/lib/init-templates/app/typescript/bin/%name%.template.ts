#!/usr/bin/env node
import { App, Stack, StackProps } from 'aws-cdk';
import { Topic } from 'aws-cdk-sns';
import { Queue } from 'aws-cdk-sqs';

class %name.PascalCased%Stack extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const queue = new Queue(this, '%name.PascalCased%Queue', {
            visibilityTimeoutSec: 300
        });

        const topic = new Topic(this, '%name.PascalCased%Topic');

        topic.subscribeQueue(queue);
    }
}

const app = new App(process.argv);

new %name.PascalCased%Stack(app, '%name.PascalCased%Stack');

process.stdout.write(app.run());
