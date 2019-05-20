import lambda = require('@aws-cdk/aws-lambda');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
import { RuntimeValue } from '../lib';

function runtimeCode(_event: any, _context: any, callback: any) {
  return callback();
}

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const queue = new sqs.Queue(this, 'MyQueue');
    const fn = new lambda.Function(this, 'MyFunction', {
      code: lambda.Code.inline(`exports.handler = ${runtimeCode.toString()}`),
      runtime: lambda.Runtime.NodeJS810,
      handler: 'index.handler'
    });

    // this line defines an AWS::SSM::Parameter resource with the
    // key "/rtv/<stack-name>/com.myorg/MyQueueURL" and the actual queue URL as value
    const queueUrlRtv = new RuntimeValue(this, 'MyQueueURL', {
      package: 'com.myorg',
      value: queue.queueUrl
    });

    // this line adds read permissions for this SSM parameter to the policies associated with
    // the IAM roles of the Lambda function and the EC2 fleet
    queueUrlRtv.grantRead(fn);

    // adds the `RTV_STACK_NAME` to the environment of the lambda function
    // and the fleet (via user-data)
    fn.addEnvironment(RuntimeValue.ENV_NAME, queueUrlRtv.envValue);
  }
}

const app = new cdk.App();

new TestStack(app, 'aws-cdk-rtv-lambda');

app.run();
