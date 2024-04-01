import { HttpMethod, PassthroughBehavior, WebSocketApi, WebSocketIntegrationResponseKey, WebSocketStage } from 'aws-cdk-lib/aws-apigatewayv2';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, CfnOutput, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { WebSocketAwsIntegration, WebSocketMockIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Stack verification steps:
 * 1. Connect: 'wscat -c <endpoint-in-the-stack-output>'. Should connect successfully
 * 2. Sending: '> {"action":"putItem", "data": "valid"}' should return {sucess: true}
 *    and add an item to the table, with the userData field set to "valid"
 * 2. Sending: '> {"action":"putItem", "data": 1}' should return {error: "Bad request"} and not insert an item to the table
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
  defaultRouteOptions: {
    integration: new WebSocketMockIntegration('DefaultIntegration'),
    returnResponse: true,
  },
});

// Optionally, create a WebSocket stage
const stage = new WebSocketStage(stack, 'DevStage', {
  webSocketApi: webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

webSocketApi.addRoute('putItem', {
  integration: new WebSocketAwsIntegration('DynamodbPutItem', {
    integrationUri: `arn:aws:apigateway:${stack.region}:dynamodb:action/PutItem`,
    integrationMethod: HttpMethod.POST,
    credentialsRole: apiRole,
    requestTemplates: {
      $default: `{
        "TableName": "${table.tableName}",
        "Item": {
          "id": { "S": "$context.requestId" },
          "userData": { "S": $input.json('$.data') }
        }
      }`,
    },
    responses: [
      {
        responseKey: WebSocketIntegrationResponseKey.default,
        responseTemplates: {
          'application/json': JSON.stringify({ success: true }),
        },
      },
      {
        responseKey: WebSocketIntegrationResponseKey.clientError,
        responseTemplates: {
          'application/json': JSON.stringify({ error: 'Bad request' }),
        },
      },
    ],
    templateSelectionExpression: '\\$default',
    passthroughBehavior: PassthroughBehavior.NEVER,
    timeout: Duration.seconds(10),
  }),
  returnResponse: true,
});

new CfnOutput(stack, 'ApiEndpoint', { value: stage.url });

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
