import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiEventBridgeStack extends cdk.Stack {
  public readonly lambdaTestFn: nodejs.NodejsFunction;
  public readonly eventBus: events.EventBus;
  public readonly sqsQueue: sqs.Queue;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.EventApi(this, 'EventApiEventBridge', {
      apiName: 'EventBridgeEventApi',
    });

    this.eventBus = new events.EventBus(this, 'test-bus');
    this.sqsQueue = new sqs.Queue(this, 'test-queue');
    new events.Rule(this, 'eventapi-rule', {
      eventBus: this.eventBus,
      eventPattern: {
        source: ['appsync.eventapi'],
      },
      targets: [
        new targets.SqsQueue(this.sqsQueue),
      ],
    });

    const dataSource = api.addEventBridgeDataSource('eventbridgeds', this.eventBus);

    api.addChannelNamespace('chat', {
      code: appsync.Code.fromAsset(path.join(__dirname, 'integ-assets', 'eventapi-handlers', 'eb.js')),
      publishHandlerConfig: {
        dataSource: dataSource,
      },
    });

    const lambdaConfig: nodejs.NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        EVENT_API_REALTIME_URL: `wss://${api.realtimeDns}/event/realtime`,
        EVENT_API_HTTP_URL: `https://${api.httpDns}/event`,
        API_KEY: api.apiKeys.Default.attrApiKey,
      },
      bundling: {
        bundleAwsSDK: true,
      },
      entry: path.join(__dirname, 'integ-assets', 'eventapi-grant-assertion', 'index.js'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(15),
    };

    this.lambdaTestFn = new nodejs.NodejsFunction(this, 'EventApiEventBridgeTestFunction', lambdaConfig);
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new EventApiEventBridgeStack(app, 'EventApiEventBridgeStack');

const integTest = new IntegTest(app, 'appsync-eventapi-eventbridge-test', {
  testCases: [stack],
});

integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    channel: 'chat/messages',
    action: 'publish',
    authMode: 'API_KEY',
    eventPayload: [{
      message: 'hello1',
    }],
  }),
}).next(integTest.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: stack.sqsQueue.queueUrl,
  WaitTimeSeconds: 20,
})
  .assertAtPath('Messages.0.Body.detail.message', ExpectedResult.stringLikeRegexp('hello1')));
