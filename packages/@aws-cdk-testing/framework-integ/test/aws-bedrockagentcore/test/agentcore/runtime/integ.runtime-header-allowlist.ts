/**
 * Integration test for Runtime request header allowlist with expanded header patterns.
 * Verifies that headers beyond the X-Amzn-Bedrock-AgentCore-Runtime-Custom- prefix
 * are accepted by the construct and produce valid CloudFormation templates.
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-header-allowlist

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-header-allowlist');

const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
  { platform: assets.Platform.LINUX_ARM64 },
);

new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_header_allowlist',
  description: 'Integration test for expanded header allowlist',
  agentRuntimeArtifact: runtimeArtifact,
  protocolConfiguration: agentcore.ProtocolType.HTTP,
  networkConfiguration: agentcore.RuntimeNetworkConfiguration.usingPublicNetwork(),
  requestHeaderConfiguration: {
    allowlistedHeaders: [
      'X-Amzn-Bedrock-AgentCore-Runtime-Custom-MyHeader',
      'X-Custom-Auth',
      'X-Request-Signature',
    ],
  },
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntimeHeaderAllowlistTest', {
  testCases: [stack],
  regions: ['us-west-2'],
});
