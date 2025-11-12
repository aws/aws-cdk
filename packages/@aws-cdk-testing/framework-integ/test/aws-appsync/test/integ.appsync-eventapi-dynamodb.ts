import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiDynamoDBStack extends cdk.Stack {
  public readonly lambdaTestFn: nodejs.NodejsFunction;
  public readonly table: ddb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.EventApi(this, 'EventApiDynamoDB', {
      apiName: 'DynamoDBEventApi',
    });

    this.table = new ddb.Table(this, 'table', {
      tableName: 'event-messages',
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const dataSource = api.addDynamoDbDataSource('ddbsource', this.table);

    api.addChannelNamespace('chat', {
      code: appsync.Code.fromAsset(path.join(__dirname, 'integ-assets', 'eventapi-handlers', 'ddb.js')),
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

    this.lambdaTestFn = new nodejs.NodejsFunction(this, 'EventApiDynamoDBTestFunction', lambdaConfig);
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new EventApiDynamoDBStack(app, 'EventApiDynamoDBStack');

const integTest = new IntegTest(app, 'appsync-eventapi-dynamodb-test', {
  testCases: [stack],
});

integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    action: 'publish',
    authMode: 'API_KEY',
    channel: 'chat/messages',
    eventPayload: [{
      id: '1',
      message: 'Test',
    }, {
      id: '2',
      message: 'Test2',
    }, {
      id: '3',
      message: 'Test3',
    }],
  }),
});

integTest.assertions.awsApiCall('DynamoDB', 'batchGetItem', {
  RequestItems: {
    'event-messages': {
      Keys: [
        {
          id: { S: '1' },
        },
        {
          id: { S: '2' },
        },
        {
          id: { S: '3' },
        },
      ],
    },
  },
}).expect(ExpectedResult.objectLike({
  Responses: {
    'event-messages': [
      {
        id: { S: '1' },
        message: { S: 'Test' },
        ddb: { BOOL: true },
      },
      {
        id: { S: '2' },
        message: { S: 'Test2' },
        ddb: { BOOL: true },
      },
      {
        id: { S: '3' },
        message: { S: 'Test3' },
        ddb: { BOOL: true },
      },
    ],
  },
})).waitForAssertions();
