import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cdk-agentcore-gateway-iam-credential-provider');

// Minimal MCP server backing the gateway target. AgentCore calls `initialize`
// and `tools/list` against the endpoint during stack stabilization, so we need
// a real responder that advertises at least one tool.
//
// Function URL auth is AWS_IAM — the gateway signs outbound requests with SigV4
// using `service: lambda` from the IamCredentialProvider, and Lambda strictly
// validates the signature. If the IamCredentialProvider service / region were
// not flowing through to the outbound signing step, Lambda would reject the
// request with 403 and stack stabilization would fail.
const mcpServer = new lambda.Function(stack, 'McpServer', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
exports.handler = async (event) => {
  const body = event.body ? JSON.parse(event.body) : {};
  const id = body.id ?? null;
  const requestedVersion = body.params?.protocolVersion ?? '2025-06-18';
  let result;
  switch (body.method) {
    case 'initialize':
      result = {
        protocolVersion: requestedVersion,
        capabilities: { tools: {} },
        serverInfo: { name: 'integ-mcp-server', version: '0.0.1' },
      };
      break;
    case 'tools/list':
      result = {
        tools: [
          {
            name: 'echo',
            description: 'Echoes the input back',
            inputSchema: {
              type: 'object',
              properties: { text: { type: 'string' } },
              required: ['text'],
            },
          },
        ],
      };
      break;
    default:
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } }),
      };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id, result }),
  };
};
  `),
});

const mcpUrl = mcpServer.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.AWS_IAM,
});

const gateway = new agentcore.Gateway(stack, 'Gateway', {
  gatewayName: 'iam-cred-provider-gw',
});

// Identity-based grant: gateway role can call lambda:InvokeFunctionUrl.
mcpUrl.grantInvokeUrl(gateway.role);

const target = gateway.addMcpServerTarget('McpServerTarget', {
  gatewayTargetName: 'mcp-server-with-explicit-sigv4',
  endpoint: mcpUrl.url,
  credentialProviderConfigurations: [
    agentcore.GatewayCredentialProvider.fromIamRole({
      service: 'lambda',
      region: cdk.Stack.of(stack).region,
    }),
  ],
});

const integTest = new integ.IntegTest(app, 'GatewayIamCredentialProvider', {
  testCases: [stack],
});

const apiCall = integTest.assertions.awsApiCall('bedrock-agentcore-control', 'getGatewayTarget', {
  gatewayIdentifier: gateway.gatewayId,
  targetId: target.targetId,
});

apiCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['bedrock-agentcore:GetGatewayTarget'],
  Resource: ['*'],
});

apiCall.expect(integ.ExpectedResult.objectLike({
  name: 'mcp-server-with-explicit-sigv4',
  credentialProviderConfigurations: [
    {
      credentialProviderType: 'GATEWAY_IAM_ROLE',
      credentialProvider: {
        iamCredentialProvider: {
          service: 'lambda',
        },
      },
    },
  ],
}));
