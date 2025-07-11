import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest, InvocationType, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as destinations from 'aws-cdk-lib/aws-lambda-destinations';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

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
      runtime: STANDARD_NODEJS_RUNTIME,
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
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = async (event) => {
        console.log(event);
      };`),
    });

    new lambda.Function(this, 'EventBusLambda', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = async (event) => {
        if (event.status === 'OK') return 'success';
        throw new Error('failure');
      };`),
      onFailure: new destinations.EventBridgeDestination(),
      onSuccess: new destinations.LambdaDestination(onSuccessLambda),
    });

    const successBucket = new s3.Bucket(this, 'OnSuccessBucket');
    const failureBucket = new s3.Bucket(this, 'OnFailureBucket');

    new lambda.Function(this, 'S3', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = async (event) => {
        if (event.status === 'OK') return 'success';
        throw new Error('failure');
      };`),
      onFailure: new destinations.S3Destination(failureBucket),
      onSuccess: new destinations.S3Destination(successBucket),
      maxEventAge: Duration.hours(4),
      retryAttempts: 2,
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

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new TestStack(app, 'aws-cdk-lambda-destinations');
const integ = new IntegTest(app, 'Destinations', {
  testCases: [stack],
});

integ.assertions.invokeFunction({
  functionName: stack.fn.functionName,
  invocationType: InvocationType.EVENT,
  payload: JSON.stringify({ status: 'OK' }),
});

const message = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: stack.queue.queueUrl,
  WaitTimeSeconds: 20,
});

message.assertAtPath('Messages.0.Body.requestContext.condition', ExpectedResult.stringLikeRegexp('Success'));
message.assertAtPath('Messages.0.Body.requestPayload.status', ExpectedResult.stringLikeRegexp('OK'));
message.assertAtPath('Messages.0.Body.responseContext.statusCode', ExpectedResult.stringLikeRegexp('200'));
message.assertAtPath('Messages.0.Body.responsePayload', ExpectedResult.stringLikeRegexp('success'));
