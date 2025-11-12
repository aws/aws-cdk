import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiLambdaStack extends cdk.Stack {
  public readonly lambdaTestFn: nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.EventApi(this, 'EventApiLambda', {
      apiName: 'LambdaEventApi',
    });

    const lambdaDs = new nodejs.NodejsFunction(this, 'LambdaDs', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, 'integ-assets', 'eventapi-integrations', 'lambda-ds', 'index.js'),
      handler: 'handler',
    });

    const dataSource = api.addLambdaDataSource('lambdads', lambdaDs);

    api.addChannelNamespace('chat', {
      code: appsync.Code.fromAsset(path.join(__dirname, 'integ-assets', 'eventapi-handlers', 'lambda.js')),
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

    this.lambdaTestFn = new nodejs.NodejsFunction(this, 'EventApiLambdaTestFunction', lambdaConfig);
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new EventApiLambdaStack(app, 'EventApiLambdaStack');

const integTest = new IntegTest(app, 'appsync-eventapi-lambda-test', {
  testCases: [stack],
});

integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    channel: 'chat/add',
    action: 'pubSub',
    authMode: 'API_KEY',
    eventPayload: [{
      message: 'hello1',
    }],
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'subscribe_success',
    pubStatusCode: 200,
    pubMsg: [{
      message: 'hello1',
      custom: 'Hello from Lambda!',
    }],
  }),
}));
