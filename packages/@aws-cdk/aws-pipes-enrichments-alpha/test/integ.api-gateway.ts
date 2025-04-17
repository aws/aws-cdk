import { randomUUID } from 'crypto';
import { IPipe, ISource, ITarget, InputTransformation, Pipe, SourceConfig, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ApiGatewayEnrichment } from '../lib/api-gateway';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-enrichments-api-gateway');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetQueue = new cdk.aws_sqs.Queue(stack, 'TargetQueue');

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

class TestTarget implements ITarget {
  targetArn: string;
  inputTransformation: InputTransformation = InputTransformation.fromEventPath('$.message');

  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.targetArn = queue.queueArn;
  }

  bind(_pipe: Pipe): TargetConfig {
    return {
      targetParameters: {
        inputTemplate: this.inputTransformation.bind(_pipe).inputTemplate,
      },
    };
  }

  grantPush(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantSendMessages(pipeRole);
  }
}

const fn = new lambda.Function(stack, 'ConnectHandler', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: new lambda.InlineCode(`
  exports.handler = async function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const paramValue = event.queryStringParameters?.key || '';

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: paramValue + "-enrichment-test"
      }),
    };
  };
  `),
});

const restApi = new apigw.RestApi(stack, 'RestApi', {});
restApi.root.addResource('test').addMethod('GET', new apigw.LambdaIntegration(fn));

const enrichmentUnderTest = new ApiGatewayEnrichment(restApi, {
  method: 'GET',
  path: '/test',
  queryStringParameters: { key: '$.body' },
});

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  enrichment: enrichmentUnderTest,
  target: new TestTarget(targetQueue),
});

const test = new IntegTest(app, 'integtest-pipe-enrichments-api-gateway', {
  testCases: [stack],
});

const uniqueIdentifier = randomUUID();
const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: uniqueIdentifier,
});

putMessageOnQueue.next(test.assertions.awsApiCall('SQS', 'receiveMessage',
  {
    QueueUrl: targetQueue.queueUrl,
  })).expect(ExpectedResult.objectLike({
  Messages: [
    {
      Body: uniqueIdentifier + '-enrichment-test',
    },
  ],
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(30),
});
