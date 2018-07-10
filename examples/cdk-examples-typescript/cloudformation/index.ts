import * as cdk from '@aws-cdk/core';
import * as sqs from '@aws-cdk/sqs';

class CloudFormationExample extends cdk.Stack {
    constructor(parent: cdk.App) {
        super(parent);

        new sqs.cloudformation.QueueResource(this, 'MyQueue', {
            visibilityTimeout: 300
        });
    }
}

const app = new cdk.App(process.argv);

new CloudFormationExample(app);

process.stdout.write(app.run());
