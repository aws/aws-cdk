import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');

class CloudFormationExample extends cdk.Stack {
  constructor(scope: cdk.App) {
    super(scope);

    new sqs.CfnQueue(this, 'MyQueue', {
      visibilityTimeout: 300
    });
  }
}

const app = new cdk.App();

new CloudFormationExample(app);

app.run();
