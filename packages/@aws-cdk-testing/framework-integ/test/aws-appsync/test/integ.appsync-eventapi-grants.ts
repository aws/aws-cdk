import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiApiGrantStack extends cdk.Stack {
  public readonly eventApi: appsync.EventApi;
  public readonly subscribeFunction: nodejs.NodejsFunction;
  public readonly publishFunction: nodejs.NodejsFunction;
  public readonly pubSubFunction: nodejs.NodejsFunction;
  public readonly pubSubAllChannelsFunction: nodejs.NodejsFunction;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    this.eventApi = new appsync.EventApi(this, 'EventApiApiGrant', {
      apiName: 'api-grants-test',
      authorizationConfig: {
        authProviders: [
          iamProvider,
        ],
      },
    });
    const defaultNamespace = this.eventApi.addChannelNamespace('default');
    const pubSubNamespace = this.eventApi.addChannelNamespace('pubsub');
    this.eventApi.addChannelNamespace('test1');
    this.eventApi.addChannelNamespace('test2');

    const lambdaConfig: nodejs.NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        EVENT_API_REALTIME_URL: `wss://${this.eventApi.realtimeDns}/event/realtime`,
        EVENT_API_HTTP_URL: `https://${this.eventApi.httpDns}/event`,
      },
      bundling: {
        bundleAwsSDK: true,
      },
      entry: path.join(__dirname, 'integ-assets/eventapi-grant-assertion/index.js'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(15),
    };

    this.subscribeFunction = new nodejs.NodejsFunction(this, 'SubscribeFunction', lambdaConfig);
    this.eventApi.grantConnect(this.subscribeFunction);
    defaultNamespace.grantSubscribe(this.subscribeFunction);

    this.publishFunction = new nodejs.NodejsFunction(this, 'PublishFunction', lambdaConfig);
    defaultNamespace.grantPublish(this.publishFunction);

    this.pubSubFunction = new nodejs.NodejsFunction(this, 'PubSubFunction', lambdaConfig);
    this.eventApi.grantConnect(this.pubSubFunction);
    pubSubNamespace.grantPublishAndSubscribe(this.pubSubFunction);

    this.pubSubAllChannelsFunction = new nodejs.NodejsFunction(this, 'PubSubAllChannelsFunction', lambdaConfig);
    this.eventApi.grantConnect(this.pubSubAllChannelsFunction);
    this.eventApi.grantPublishAndSubscribe(this.pubSubAllChannelsFunction);
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new EventApiApiGrantStack(app, 'EventApiApiGrantStack');

const integ = new IntegTest(app, 'appsync-event-api-grants', {
  testCases: [stack],
});

// Validate subscribe works
integ.assertions.invokeFunction({
  functionName: stack.subscribeFunction.functionName,
  payload: JSON.stringify({
    action: 'subscribe',
    channel: 'default',
    authMode: 'IAM',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'subscribe_success',
  }),
}));

// Validate publish works
integ.assertions.invokeFunction({
  functionName: stack.publishFunction.functionName,
  payload: JSON.stringify({
    action: 'publish',
    channel: 'default',
    authMode: 'IAM',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'publish_success',
  }),
}));

// Validate pub/sub works
integ.assertions.invokeFunction({
  functionName: stack.pubSubFunction.functionName,
  payload: JSON.stringify({
    action: 'pubSub',
    channel: 'pubsub',
    authMode: 'IAM',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'subscribe_success',
    pubStatusCode: 200,
    pubMsg: [{
      message: 'Hello World!',
    }],
  }),
}));

// Test unauthorized case for publish
integ.assertions.invokeFunction({
  functionName: stack.publishFunction.functionName,
  payload: JSON.stringify({
    action: 'publish',
    channel: 'test1',
    authMode: 'IAM',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 403,
    msg: 'Forbidden',
  }),
}));

// Test unauthorized case for subscribe
integ.assertions.invokeFunction({
  functionName: stack.subscribeFunction.functionName,
  payload: JSON.stringify({
    action: 'subscribe',
    channel: 'test1',
    authMode: 'IAM',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 403,
    msg: 'Forbidden',
  }),
}));

// Test Event API level grant pub sub subscribe
integ.assertions.invokeFunction({
  functionName: stack.pubSubAllChannelsFunction.functionName,
  payload: JSON.stringify({
    action: 'pubSub',
    channel: 'test1/subtest',
    authMode: 'IAM',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'subscribe_success',
    pubStatusCode: 200,
    pubMsg: [{
      message: 'Hello World!',
    }],
  }),
}));

new cdk.CfnOutput(stack, 'AWS AppSync Events HTTP endpoint', { value: stack.eventApi.httpDns });
new cdk.CfnOutput(stack, 'AWS AppSync Events Realtime endpoint', { value: stack.eventApi.realtimeDns });
