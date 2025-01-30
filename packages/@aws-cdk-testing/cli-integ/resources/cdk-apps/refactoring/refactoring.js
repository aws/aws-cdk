const cdk = require('aws-cdk-lib');
const sqs = require('aws-cdk-lib/aws-sqs');

const stackPrefix = process.env.STACK_NAME_PREFIX;

const app = new cdk.App();

class NoticesStackRefactored extends cdk.Stack {
    constructor(parent, id, props) {
        super(parent, id, props);
        new sqs.Queue(this, 'newQueueName');
    }
}

new NoticesStackRefactored(app, `${stackPrefix}-notices`);