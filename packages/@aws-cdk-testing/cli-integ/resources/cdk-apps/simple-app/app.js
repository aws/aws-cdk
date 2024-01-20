const cdk = require('aws-cdk-lib/core');
const iam = require('aws-cdk-lib/aws-iam');
const sqs = require('aws-cdk-lib/aws-sqs');

const stackPrefix = process.env.STACK_NAME_PREFIX;
if (!stackPrefix) {
  throw new Error(`the STACK_NAME_PREFIX environment variable is required`);
}

class SimpleStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    const queue = new sqs.Queue(this, 'queue', {
      visibilityTimeout: cdk.Duration.seconds(300),
    });
    const role = new iam.Role(this, 'role', {
      assumedBy: new iam.AccountRootPrincipal(),
    });
    queue.grantConsumeMessages(role);
  }
}

const app = new cdk.App();
new SimpleStack(app, `${stackPrefix}-simple-1`);

app.synth();
