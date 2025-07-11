import { WebSocketApi, WebSocketStage } from 'aws-cdk-lib/aws-apigatewayv2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'integ-apigwv2-lambda-connect-integration');
const webSocketTableName = 'WebSocketConnections';

const connectFunction = new lambda.Function(stack, 'Connect Function', {
  functionName: 'process_connect_requests',
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas', 'connect')),
  timeout: cdk.Duration.seconds(5),
  environment: {
    TABLE_NAME: webSocketTableName,
  },
});

const disconnectFunction = new lambda.Function(
  stack,
  'Disconnect Function',
  {
    functionName: 'process_disconnect_requests',
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    code: lambda.Code.fromAsset(
      path.join(__dirname, 'lambdas', 'disconnect'),
    ),
    timeout: cdk.Duration.seconds(5),
    environment: {
      TABLE_NAME: webSocketTableName,
    },
  },
);

const webSocketLogTable = new dynamodb.Table(stack, 'WebSocket Log Table', {
  tableName: webSocketTableName,
  partitionKey: {
    name: 'ConnectionId',
    type: dynamodb.AttributeType.STRING,
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY, // not recommended for production
});
webSocketLogTable.grantReadWriteData(connectFunction);
webSocketLogTable.grantReadWriteData(disconnectFunction);

const webSocketConnectIntegration = new WebSocketLambdaIntegration(
  'ConnectIntegration',
  connectFunction,
);
const webSocketDisconnectIntegration = new WebSocketLambdaIntegration(
  'DisconnectIntegration',
  disconnectFunction,
);

const webSocketApi = new WebSocketApi(stack, 'WebSocket API', {
  apiName: 'webSocket',
  routeSelectionExpression: '$request.body.action',
  connectRouteOptions: { integration: webSocketConnectIntegration },
  disconnectRouteOptions: { integration: webSocketDisconnectIntegration },
});

new WebSocketStage(
  stack,
  'Production Stage',
  {
    webSocketApi: webSocketApi,
    stageName: 'prod',
    autoDeploy: true,
  },
);

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();
