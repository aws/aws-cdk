import { ContentHandling, HttpMethod, PassthroughBehavior, WebSocketApi, WebSocketStage } from 'aws-cdk-lib/aws-apigatewayv2';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { WebSocketAwsIntegration, WebSocketMockIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Stack verification steps:
 * 1. Verify manually that the integration has type "MOCK"
 */

const app = new App();
const stack = new Stack(app, 'integ-aws-websocket-integration');

const table = new dynamodb.Table(stack, 'MyTable', {
  tableName: 'MyTable',
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  removalPolicy: RemovalPolicy.DESTROY,
});

// Create an IAM role for API Gateway
const apiRole = new iam.Role(stack, 'ApiGatewayRole', {
  assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')],
});

const webSocketApi = new WebSocketApi(stack, 'mywsapi', {
  defaultRouteOptions: { integration: new WebSocketMockIntegration('DefaultIntegration') },
});

// Optionally, create a WebSocket stage
new WebSocketStage(stack, 'DevStage', {
  webSocketApi: webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

webSocketApi.addRoute('$connect', {
  integration: new WebSocketAwsIntegration('DynamodbPutItem', {
    integrationUri: `arn:aws:apigateway:${stack.region}:dynamodb:action/PutItem`,
    integrationMethod: HttpMethod.POST,
    credentialsRole: apiRole,
    requestParameters: {
      'integration.request.header.Content-Type': '\'application/x-www-form-urlencoded\'',
    },
    requestTemplates: {
      'application/json': JSON.stringify({
        TableName: table.tableName,
        Item: {
          id: {
            S: '$context.requestId',
          },
        },
      }),
    },
    templateSelectionExpression: '\\$default',
    passthroughBehavior: PassthroughBehavior.WHEN_NO_TEMPLATES,
    contentHandling: ContentHandling.CONVERT_TO_BINARY,
    timeout: Duration.seconds(10),
  }),
});

new IntegTest(app, 'apigatewayv2-aws-integration-integ-test', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
