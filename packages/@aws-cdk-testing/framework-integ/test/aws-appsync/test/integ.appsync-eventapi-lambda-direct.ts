import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiLambdaDirectStack extends cdk.Stack {
  public readonly lambdaTestFn: nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.EventApi(this, 'EventApiLambda', {
      apiName: 'LambdaEventApi',
    });

    const lambdaDirect = new nodejs.NodejsFunction(this, 'LambdaDirect', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, 'integ-assets', 'eventapi-integrations', 'direct-lambda-ds', 'index.js'),
      handler: 'handler',
    });

    const dataSource = api.addLambdaDataSource('lambdadirect', lambdaDirect);

    api.addChannelNamespace('chat', {
      subscribeHandlerConfig: {
        dataSource: dataSource,
        direct: true,
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
const stack = new EventApiLambdaDirectStack(app, 'EventApiLambdaDirectStack');

const integTest = new IntegTest(app, 'appsync-eventapi-lambda-direct-test', {
  testCases: [stack],
});

integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    channel: 'chat/testing',
    action: 'subscribe',
    authMode: 'API_KEY',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'subscribe_success',
  }),
}));

integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    channel: 'chat/invalid',
    action: 'subscribe',
    authMode: 'API_KEY',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 400,
    msg: 'HandlerExecutionError',
  }),
}));
