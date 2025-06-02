import { randomUUID } from 'crypto';
import { IPipe, ISource, ITarget, InputTransformation, Pipe, SourceConfig, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as events from 'aws-cdk-lib/aws-events';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { ApiDestinationEnrichment } from '../lib';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-pipes-enrichments-lambda');
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
    const body = event.body ? JSON.parse(event.body) : {};
    const paramValue = body['body'] || '';

    console.log(event);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: paramValue + "-enrichment-test" }),
    };
  };
  `),
});

const integration = new HttpLambdaIntegration('LambdaIntegration', fn);
const httpApi = new apigwv2.HttpApi(stack, 'HttpApi');
httpApi.addRoutes({
  path: '/test',
  methods: [apigwv2.HttpMethod.POST],
  integration,
});

const secret = new secretsmanager.Secret(stack, 'MySecret', {
  secretStringValue: cdk.SecretValue.unsafePlainText('abc123'),
});

const connection = new events.Connection(stack, 'MyConnection', {
  authorization: events.Authorization.apiKey('x-api-key', secret.secretValue),
  description: 'Connection with API Key x-api-key',
  connectionName: 'MyConnection',
});

const destination = new events.ApiDestination(stack, 'MyDestination', {
  connection,
  endpoint: `${httpApi.apiEndpoint}/test`,
  httpMethod: cdk.aws_events.HttpMethod.POST,
});

const enrichmentUnderTest = new ApiDestinationEnrichment(destination, {
});

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  enrichment: enrichmentUnderTest,
  target: new TestTarget(targetQueue),
});

const test = new IntegTest(app, 'integtest-pipe-enrichments-lambda', {
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
