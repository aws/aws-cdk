import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiApiKeyAuthStack extends cdk.Stack {
  public readonly eventApi: appsync.EventApi;
  public readonly lambdaTestFn: nodejs.NodejsFunction;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
    };

    this.eventApi = new appsync.EventApi(this, 'EventApiApiKeyAuth', {
      apiName: 'api-key-auth-test',
      authorizationConfig: {
        authProviders: [
          apiKeyProvider,
        ],
      },
    });

    this.eventApi.addChannelNamespace('default');

    const lambdaConfig: nodejs.NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        EVENT_API_REALTIME_URL: `wss://${this.eventApi.realtimeDns}/event/realtime`,
        EVENT_API_HTTP_URL: `https://${this.eventApi.httpDns}/event`,
        API_KEY: this.eventApi.apiKeys.Default.attrApiKey,
      },
      bundling: {
        bundleAwsSDK: true,
      },
      entry: path.join(__dirname, 'integ-assets/eventapi-grant-assertion/index.js'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(15),
    };

    this.lambdaTestFn = new nodejs.NodejsFunction(this, 'ApiKeyConfigTestFunction', lambdaConfig);
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new EventApiApiKeyAuthStack(app, 'EventApiApiKeyAuthStack');

const integTest = new IntegTest(app, 'appsync-event-api-api-key-auth', {
  testCases: [stack],
});

// Validate subscribe works with API Key auth
integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    action: 'subscribe',
    channel: 'default',
    authMode: 'API_KEY',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'subscribe_success',
  }),
}));

// Validate publish works
integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    action: 'publish',
    channel: 'default',
    authMode: 'API_KEY',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'publish_success',
  }),
}));

new cdk.CfnOutput(stack, 'AWS AppSync Events HTTP endpoint', { value: stack.eventApi.httpDns });
new cdk.CfnOutput(stack, 'AWS AppSync Events Realtime endpoint', { value: stack.eventApi.realtimeDns });
