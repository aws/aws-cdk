import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiHttpStack extends cdk.Stack {
  public readonly lambdaTestFn: nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.EventApi(this, 'EventApiHttp', {
      apiName: 'HttpEventApi',
    });

    const randomApi = new apigw.RestApi(this, 'RandomApi');
    const randomRoute = randomApi.root.addResource('random');
    randomRoute.addMethod('GET', new apigw.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'application/json': 'my-random-value',
        },
      }],
      passthroughBehavior: apigw.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{ "statusCode": 200 }',
      },
    }), {
      methodResponses: [{ statusCode: '200' }],
    });

    const dataSource = api.addHttpDataSource('httpsource', `https://${randomApi.restApiId}.execute-api.${this.region}.amazonaws.com`);

    api.addChannelNamespace('chat', {
      code: appsync.Code.fromAsset(path.join(__dirname, 'integ-assets', 'eventapi-handlers', 'http.js')),
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

    this.lambdaTestFn = new nodejs.NodejsFunction(this, 'EventApiHttpTestFunction', lambdaConfig);
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new EventApiHttpStack(app, 'EventApiHttpStack');

const integTest = new IntegTest(app, 'appsync-eventapi-Http-test', {
  testCases: [stack],
});

integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    channel: 'chat/messages',
    action: 'pubSub',
    authMode: 'API_KEY',
    eventPayload: [{
      message: 'hello1',
    }, {
      message: 'hello2',
    }],
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'subscribe_success',
    pubStatusCode: 200,
    pubMsg: [{
      message: 'hello1',
      random: 'my-random-value',
    }, {
      message: 'hello2',
      random: 'my-random-value',
    }],
  }),
}));
