/*
 * Integration test for MCP protocol versions on an AgentCore Gateway.
 *
 * Stack verification steps:
 * * Deploy a gateway with IAM inbound auth and MCP supported versions 2025-11-25 and 2026-07-28
 * * GetGateway reports both versions in the MCP protocol configuration
 */

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreGatewayMcpProtocolVersionsIntegTest');

const gateway = new agentcore.Gateway(stack, 'Gateway', {
  gatewayName: 'integ-gateway-mcp-protocol-versions',
  description: 'Gateway with MCP protocol versions 2025-11-25 and 2026-07-28',
  // Inbound IAM avoids default Cognito domain (global uniqueness); this integ focuses on protocol versions.
  authorizerConfiguration: agentcore.GatewayAuthorizer.usingAwsIam(),
  protocolConfiguration: agentcore.GatewayProtocol.mcp({
    supportedVersions: [
      agentcore.MCPProtocolVersion.MCP_2025_11_25,
      agentcore.MCPProtocolVersion.MCP_2026_07_28,
    ],
  }),
});

const integTest = new integ.IntegTest(app, 'GatewayMcpProtocolVersionsIntegTest', {
  testCases: [stack],
});

const apiCall = integTest.assertions.awsApiCall('bedrock-agentcore-control', 'getGateway', {
  gatewayIdentifier: gateway.gatewayId,
});

// `bedrock-agentcore-control` is not in the integ-tests SDK metadata, so the
// auto-derived IAM action would be `bedrock-agentcore-control:GetGateway`
// — wrong; the real prefix is `bedrock-agentcore`.
apiCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['bedrock-agentcore:GetGateway'],
  Resource: ['*'],
});

apiCall.expect(integ.ExpectedResult.objectLike({
  protocolConfiguration: {
    mcp: {
      supportedVersions: ['2025-11-25', '2026-07-28'],
    },
  },
}));
