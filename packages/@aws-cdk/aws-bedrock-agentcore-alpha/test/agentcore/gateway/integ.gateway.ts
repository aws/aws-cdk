/**
 * Simple Integration test for AWS Bedrock AgentCore Gateway
 *
 * This test creates a basic Gateway setup to verify the integration works correctly.
 */

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../agentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreGatewayIntegTest', {
  env: {
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

// Create a simple Gateway with default configuration
const gateway = new agentcore.Gateway(stack, 'TestGateway', {
  gatewayName: 'integ-test-gateway',
  description: 'Simple integration test gateway',
});

// Create a simple Lambda function for the target
const lambdaFunction = new lambda.Function(stack, 'TestFunction', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log('Received event:', JSON.stringify(event));
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Hello from integration test!',
        }),
      };
    };
  `),
  description: 'Simple Lambda for Gateway integration test',
});

// Create a tool schema for the Lambda target
const toolSchema = agentcore.ToolSchema.fromInline([
  {
    name: 'test_tool',
    description: 'A simple test tool',
    inputSchema: {
      type: agentcore.SchemaDefinitionType.OBJECT,
      properties: {
        message: {
          type: agentcore.SchemaDefinitionType.STRING,
          description: 'Test message',
        },
      },
      required: ['message'],
    },
  },
]);

// Add Lambda target to the gateway
gateway.addLambdaTarget('TestLambdaTarget', {
  targetName: 'test-lambda-target',
  description: 'Simple Lambda target for testing',
  lambdaFunction: lambdaFunction,
  toolSchema: toolSchema,
});

// Output the gateway ID
new cdk.CfnOutput(stack, 'GatewayId', {
  value: gateway.gatewayId,
  description: 'The ID of the created gateway',
});

// Create the integration test
new integ.IntegTest(app, 'GatewayIntegTest', {
  testCases: [stack],
});

app.synth();
