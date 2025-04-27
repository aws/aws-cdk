import { randomUUID } from 'crypto';
import * as path from 'path';
import { IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LambdaFunction } from '../lib';

/**
 * Stack verification steps:
 * 1. A message with a random UUID is sent to the queue 'SourceQueue', which triggers the Lambda Function from the pipe.
 * 2. The Lambda Function adds the tag:
 *    Key: Identifier
 *    Value: <RandomUUID>
 * 3. The assertion verifies that the expected tag is created by calling listTags on the Lambda Function.
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-pipes-lambda-target');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');

// When this module is promoted from alpha, TestSource should
// be replaced with SqsSource from @aws-cdk/aws-pipes-sources-alpha
class TestSource implements ISource {
  sourceArn: string;
  sourceParameters = undefined;
  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.sourceArn = queue.queueArn;
  }
  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: this.sourceParameters,
    };
  }
  grantRead(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantConsumeMessages(pipeRole);
  }
}

const functionName = 'TestCdkPipesTargetLambdaFunction';
const targetFunction = new lambda.Function(stack, 'TargetLambdaFunction', {
  code: lambda.AssetCode.fromAsset(
    path.join(__dirname, 'integ.lambda.handler'),
  ),
  handler: 'handler.handler',
  functionName,
  runtime: lambda.Runtime.NODEJS_LATEST,
  memorySize: 512,
});
targetFunction.addToRolePolicy(
  new iam.PolicyStatement(
    new iam.PolicyStatement({
      actions: ['lambda:TagResource'],
      resources: ['*'],
    }),
  ),
);

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  target: new LambdaFunction(targetFunction, {}),
});

const test = new IntegTest(app, 'integtest-pipe-target-lambda', {
  testCases: [stack],
});

const uuid = randomUUID();
const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: uuid,
});

putMessageOnQueue
  .next(
    test.assertions.awsApiCall('Lambda', 'listTags', {
      Resource: targetFunction.functionArn,
    }),
  )
  .expect(
    ExpectedResult.objectLike({
      Tags: {
        Identifier: uuid,
      },
    }),
  )
  .waitForAssertions({
    totalTimeout: cdk.Duration.seconds(10),
  });

app.synth();
