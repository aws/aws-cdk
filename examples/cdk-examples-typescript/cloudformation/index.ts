import { App, Stack } from '@aws-cdk/core';
import { sqs } from '@aws-cdk/resources';

class CloudFormationExample extends Stack {
    constructor(parent: App) {
        super(parent);

        new sqs.QueueResource(this, 'MyQueue', {
            visibilityTimeout: 300
        });
    }
}

const app = new App(process.argv);

new CloudFormationExample(app);

process.stdout.write(app.run());
