/**
 * Integration test for AWS Bedrock AgentCore Gateway
 *
 * This test creates a complete Gateway setup with multiple targets
 * to verify the integration works correctly.
 */

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from '../../../agentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreGatewayIntegTest', {
  env: {
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

// Create a Gateway with default configuration
const gateway = new agentcore.Gateway(stack, 'TestGateway', {
  gatewayName: 'integ-test-gateway',
  description: 'Integration test gateway for Bedrock AgentCore',
  protocolConfiguration: new agentcore.McpProtocolConfiguration({
    instructions: 'This gateway is used for integration testing',
    searchType: agentcore.McpGatewaySearchType.SEMANTIC,
    supportedVersions: [agentcore.MCPProtocolVersion.MCP_2025_03_26],
  }),
  exceptionLevel: agentcore.GatewayExceptionLevel.DEBUG,
  tags: {
    Environment: 'IntegTest',
    Purpose: 'CDKIntegrationTest',
  },
});

// Create a Lambda function for the Lambda target
const lambdaFunction = new lambda.Function(stack, 'TestLambdaFunction', {
  runtime: lambda.Runtime.NODEJS_22_X,
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log('Received event:', JSON.stringify(event));
      
      // Extract the tool name from the event
      const toolName = event.toolName || 'unknown';
      
      // Simple tool responses based on tool name
      switch(toolName) {
        case 'get_weather':
          return {
            statusCode: 200,
            body: JSON.stringify({
              temperature: 72,
              condition: 'Sunny',
              humidity: 45
            })
          };
        case 'get_time':
          return {
            statusCode: 200,
            body: JSON.stringify({
              time: new Date().toISOString()
            })
          };
        default:
          return {
            statusCode: 200,
            body: JSON.stringify({
              message: 'Tool executed successfully',
              toolName: toolName
            })
          };
      }
    };
  `),
  handler: 'index.handler',
  functionName: 'bedrock-agentcore-gateway-test-function',
});

// Add Lambda target to the gateway
const lambdaTarget = gateway.addLambdaTarget('LambdaTarget', {
  targetName: 'weather-and-time-tools',
  description: 'Lambda target providing weather and time tools',
  lambdaFunction: lambdaFunction,
  toolSchema: agentcore.ToolSchema.fromInline([
    {
      name: 'get_weather',
      description: 'Get current weather information',
      inputSchema: {
        type: agentcore.SchemaDefinitionType.OBJECT,
        properties: {
          location: {
            type: agentcore.SchemaDefinitionType.STRING,
            description: 'The location to get weather for',
          },
        },
        required: ['location'],
      },
      outputSchema: {
        type: agentcore.SchemaDefinitionType.OBJECT,
        properties: {
          temperature: {
            type: agentcore.SchemaDefinitionType.NUMBER,
            description: 'Temperature in Fahrenheit',
          },
          condition: {
            type: agentcore.SchemaDefinitionType.STRING,
            description: 'Weather condition',
          },
          humidity: {
            type: agentcore.SchemaDefinitionType.NUMBER,
            description: 'Humidity percentage',
          },
        },
      },
    },
    {
      name: 'get_time',
      description: 'Get current time',
      inputSchema: {
        type: agentcore.SchemaDefinitionType.OBJECT,
        properties: {
          timezone: {
            type: agentcore.SchemaDefinitionType.STRING,
            description: 'Timezone for the time',
          },
        },
      },
      outputSchema: {
        type: agentcore.SchemaDefinitionType.OBJECT,
        properties: {
          time: {
            type: agentcore.SchemaDefinitionType.STRING,
            description: 'Current time in ISO format',
          },
        },
      },
    },
  ]),
});

// Add an OpenAPI target for external API integration
const openApiTarget = gateway.addOpenApiTarget('OpenApiTarget', {
  targetName: 'external-api-tools',
  description: 'OpenAPI target for external service integration',
  apiSchema: agentcore.ApiSchema.fromInline(`
openapi: 3.0.3
info:
  title: External Service API
  version: 1.0.0
  description: Example external service for integration testing
servers:
  - url: https://api.example.com/v1
paths:
  /users/{userId}:
    get:
      summary: Get user by ID
      operationId: getUser
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  name:
                    type: string
                  email:
                    type: string
  /search:
    get:
      summary: Search items
      operationId: searchItems
      parameters:
        - name: query
          in: query
          required: true
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: Search results
          content:
            application/json:
              schema:
                type: object
                properties:
                  results:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: string
                        title:
                          type: string
                        description:
                          type: string
  `),
  credentialProviderConfigurations: [
    agentcore.GatewayCredentialProvider.apiKey({
      providerArn: 'arn:aws:bedrock:us-east-1:123456789012:api-key/test-key',
      credentialLocation: agentcore.ApiKeyCredentialLocation.header({
        credentialParameterName: 'X-API-Key',
        credentialPrefix: 'Bearer ',
      }),
    }),
  ],
});

// Output important values
new cdk.CfnOutput(stack, 'GatewayId', {
  value: gateway.gatewayId,
  description: 'The ID of the created gateway',
});

new cdk.CfnOutput(stack, 'GatewayArn', {
  value: gateway.gatewayArn,
  description: 'The ARN of the created gateway',
});

new cdk.CfnOutput(stack, 'GatewayUrl', {
  value: gateway.gatewayUrl || 'Not available',
  description: 'The URL endpoint for the gateway',
});

new cdk.CfnOutput(stack, 'LambdaTargetId', {
  value: lambdaTarget.targetId,
  description: 'The ID of the Lambda target',
});

new cdk.CfnOutput(stack, 'OpenApiTargetId', {
  value: openApiTarget.targetId,
  description: 'The ID of the OpenAPI target',
});

// If a default Cognito user pool was created, output its details
if (gateway.userPool) {
  new cdk.CfnOutput(stack, 'UserPoolId', {
    value: gateway.userPool.userPoolId,
    description: 'The ID of the Cognito User Pool for authentication',
  });
}

if (gateway.userPoolClient) {
  new cdk.CfnOutput(stack, 'UserPoolClientId', {
    value: gateway.userPoolClient.userPoolClientId,
    description: 'The ID of the Cognito User Pool Client',
  });
}

app.synth();
