import { HttpMethod, PassthroughBehavior, WebSocketApi, WebSocketStage } from 'aws-cdk-lib/aws-apigatewayv2';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Stack, Aws } from 'aws-cdk-lib';
import { WebSocketAwsIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Stack verification steps:
 * 1. Verify manually that the integration has type "AWS"
 */

const app = new App();
const stack = new Stack(app, 'integ-aws-websocket-sqs-integration');

const sqsMessageQueue = new sqs.Queue(stack, 'MessageSQSQueue', {
  fifo: true,
  queueName: 'MessageSQSQueue.fifo',
});

// API Gateway WebSocket API
const webSocketApi = new WebSocketApi(stack, 'webSocketApi', {
  description: 'Send websocket data to SQS which is then processed by a Lambda 2',
  routeSelectionExpression: '$request.body.action',
});

// Optionally, create a WebSocket stage
new WebSocketStage(stack, 'DevStage', {
  webSocketApi: webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

// IAM Role for API Gateway
const webSocketApiRole = new iam.Role(stack, 'webSocketApiRole', {
  assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
});

webSocketApiRole.addToPolicy(
  new iam.PolicyStatement({
    actions: ['sqs:SendMessage'],
    effect: iam.Effect.ALLOW,
    resources: [sqsMessageQueue.queueArn],
  }),
);

webSocketApi.addRoute('$default', {
  integration: new WebSocketAwsIntegration('SQSSendMessage', {
    integrationUri: `arn:aws:apigateway:${Aws.REGION}:sqs:path/${Aws.ACCOUNT_ID}/${sqsMessageQueue.queueName}`,
    integrationMethod: HttpMethod.POST,
    credentialsRole: webSocketApiRole,
    passthroughBehavior: PassthroughBehavior.NEVER,
    templateSelectionExpression: '\\$default',
    requestTemplates: {
      $default: 'Action=SendMessage&MessageGroupId=$input.path(\'$.MessageGroupId\')&MessageDeduplicationId=$context.requestId&MessageAttribute.1.Name=connectionId&MessageAttribute.1.Value.StringValue=$context.connectionId&MessageAttribute.1.Value.DataType=String&MessageAttribute.2.Name=requestId&MessageAttribute.2.Value.StringValue=$context.requestId&MessageAttribute.2.Value.DataType=String&MessageBody=$input.json(\'$\')',
    },
    requestParameters: {
      'integration.request.header.Content-Type': '\'application/x-www-form-urlencoded\'',
    },
  }),
});

new IntegTest(app, 'apigatewayv2-aws-integration-sqs-integ-test', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
