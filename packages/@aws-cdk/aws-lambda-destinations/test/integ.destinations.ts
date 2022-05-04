import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import { App, Duration, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest, InvocationType, ExpectedResult } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as destinations from '../lib';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"NOT OK"' response.json
 */

class TestStack extends Stack {
  public readonly fn: lambda.Function;
  public readonly queue: sqs.Queue;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'Topic');
    this.queue = new sqs.Queue(this, 'Queue');

    this.fn = new lambda.Function(this, 'SnsSqs', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = async (event) => {
        if (event.status === 'OK') return 'success';
        throw new Error('failure');
      };`),
      onFailure: new destinations.SnsDestination(topic),
      onSuccess: new destinations.SqsDestination(this.queue),
      maxEventAge: Duration.hours(3),
      retryAttempts: 1,
    });

    const onSuccessLambda = new lambda.Function(this, 'OnSucces', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = async (event) => {
        console.log(event);
      };`),
    });

    new lambda.Function(this, 'EventBusLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = async (event) => {
        if (event.status === 'OK') return 'success';
        throw new Error('failure');
      };`),
      onFailure: new destinations.EventBridgeDestination(),
      onSuccess: new destinations.LambdaDestination(onSuccessLambda),
    });

    const version = this.fn.addVersion('MySpecialVersion');

    new lambda.Alias(this, 'MySpecialAlias', {
      aliasName: 'MySpecialAlias',
      version,
      onSuccess: new destinations.SqsDestination(this.queue),
      onFailure: new destinations.SnsDestination(topic),
      maxEventAge: Duration.hours(2),
      retryAttempts: 0,
    });
  }
}

const app = new App();

const stack = new TestStack(app, 'aws-cdk-lambda-destinations');
const integ = new IntegTest(app, 'Destinations', {
  testCases: [stack],
});

integ.assert.invokeFunction({
  functionName: stack.fn.functionName,
  invocationType: InvocationType.EVENT,
  payload: JSON.stringify({ status: 'OK' }),
});

const message = integ.assert.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: stack.queue.queueUrl,
  WaitTimeSeconds: 20,
});

message.assertAtPath('Messages.0.Body', ExpectedResult.objectLike({
  requestContext: {
    condition: 'Success',
  },
  requestPayload: {
    status: 'OK',
  },
  responseContext: {
    statusCode: 200,
  },
  responsePayload: 'success',
}));

app.synth();
