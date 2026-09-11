import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreGatewayMcpProtocolIntegTest', {
});

const gateway = new agentcore.Gateway(stack, 'McpProtocolGateway', {
  gatewayName: 'integ-test-mcp-protocol-gateway',
  description: 'Integration test gateway with explicit MCP session/streaming configuration',
  protocolConfiguration: agentcore.GatewayProtocol.mcp({
    instructions: 'Use this gateway to connect to external MCP tools',
    searchType: agentcore.McpGatewaySearchType.SEMANTIC,
    supportedVersions: [agentcore.MCPProtocolVersion.MCP_2025_03_26],
    sessionTimeout: cdk.Duration.minutes(30),
    enableResponseStreaming: true,
  }),
});

const lambdaFunction = new lambda.Function(stack, 'TestFunction', {
  functionName: 'integ-test-mcp-protocol-gateway-lambda',
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log('Received event:', JSON.stringify(event));
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Hello from Lambda!',
          input: event,
        }),
      };
    };
  `),
  description: 'Lambda function for MCP protocol configuration integration test',
});

const lambdaToolSchema = agentcore.ToolSchema.fromInline([
  {
    name: 'greeting_tool',
    description: 'A greeting tool that returns a message',
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

gateway.addLambdaTarget('LambdaTarget', {
  gatewayTargetName: 'lambda-greeting-target',
  description: 'Lambda target for MCP protocol configuration gateway',
  lambdaFunction: lambdaFunction,
  toolSchema: lambdaToolSchema,
});

new integ.IntegTest(app, 'GatewayMcpProtocolIntegTest', {
  testCases: [stack],
});
