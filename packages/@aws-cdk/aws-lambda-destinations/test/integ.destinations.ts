import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import { App, Construct, Duration, Stack, StackProps } from '@aws-cdk/core';
import destinations = require('../lib');

// After deploy, test with:
// aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
// aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"NOT OK"' response.json

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'Topic');
    const queue = new sqs.Queue(this, 'Queue');

    new lambda.Function(this, 'Function', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = async (event) => {
        if (event === 'OK') return 'success';
        throw new Error('failure');
      };`),
      onFailure: new destinations.SnsTopic(topic),
      onSuccess: new destinations.SqsQueue(queue),
      maximumEventAge: Duration.hours(3),
      maximumRetryAttemps: 1
    });
  }
}

const app = new App();

new TestStack(app, 'aws-cdk-lambda-destinations');

app.synth();
