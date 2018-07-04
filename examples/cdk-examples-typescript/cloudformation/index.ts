import { App, Stack } from '@aws-cdk/core';
import { QueueResource } from '@aws-cdk/sqs';

class CloudFormationExample extends Stack {
    constructor(parent: App) {
        super(parent);

        new QueueResource(this, 'MyQueue', {
            visibilityTimeout: 300
        });
    }
}

const app = new App(process.argv);

new CloudFormationExample(app);

process.stdout.write(app.run());
