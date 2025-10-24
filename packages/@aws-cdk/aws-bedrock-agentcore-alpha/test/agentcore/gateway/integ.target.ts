/**
 * Simple Integration test for AWS Bedrock AgentCore Gateway Target with Lambda
 *
 * This test creates a Gateway with a Lambda target to verify the integration works correctly.
 */

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../agentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreTargetIntegTest', {
  env: {
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

// Create a simple Gateway
const gateway = new agentcore.Gateway(stack, 'TestGateway', {
  gatewayName: 'target-integ-test-gateway',
  description: 'Gateway for Lambda target integration test',
});

// Create a Lambda function
const lambdaFunction = new lambda.Function(stack, 'TestLambda', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log('Received event:', JSON.stringify(event));
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Hello from Lambda target!',
          input: event,
        }),
      };
    };
  `),
  description: 'Lambda function for Gateway target integration test',
});

// Create a tool schema for the Lambda target
const toolSchema = agentcore.ToolSchema.fromInline([
  {
    name: 'greeting_tool',
    description: 'A simple greeting tool',
    inputSchema: {
      type: agentcore.SchemaDefinitionType.OBJECT,
      properties: {
        name: {
          type: agentcore.SchemaDefinitionType.STRING,
          description: 'Name to greet',
        },
      },
      required: ['name'],
    },
  },
]);

// Add Lambda target to the gateway
const target = gateway.addLambdaTarget('LambdaTarget', {
  gatewayTargetName: 'lambda-greeting-target',
  description: 'Lambda target for greeting service',
  lambdaFunction: lambdaFunction,
  toolSchema: toolSchema,
});

// Output the gateway and target IDs
new cdk.CfnOutput(stack, 'GatewayId', {
  value: gateway.gatewayId,
  description: 'The ID of the created gateway',
});

new cdk.CfnOutput(stack, 'TargetId', {
  value: target.targetId,
  description: 'The ID of the created target',
});

new cdk.CfnOutput(stack, 'LambdaArn', {
  value: lambdaFunction.functionArn,
  description: 'The ARN of the Lambda function',
});

// Create the integration test
new integ.IntegTest(app, 'TargetIntegTest', {
  testCases: [stack],
});

app.synth();
