/**
 * Integration test for Runtime PlatformVersion (V2).
 * Verifies that `platformVersion` is accepted by the Runtime construct, produces a valid
 * CloudFormation template with the PlatformVersion property set, and deploys a real V2 runtime
 * that reaches READY.
 *
 * NOTE: for this test to pass, the container must correctly implement the AgentCore runtime
 * HTTP contract (serve `GET /ping` for health and `POST /invocations` on port 8080). Otherwise
 * the runtime fails to stabilize ("runtime process exited unexpectedly"). That is why this test
 * uses its own `platformVersionArtifact` fixture rather than a placeholder image.
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-platformversion

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-platformversion');

const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'platformVersionV2Artifact'),
  { platform: assets.Platform.LINUX_ARM64 },
);

new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_platformversion',
  description: 'Integration test for runtime PlatformVersion V2',
  agentRuntimeArtifact: runtimeArtifact,
  protocolConfiguration: agentcore.ProtocolType.HTTP,
  networkConfiguration: agentcore.RuntimeNetworkConfiguration.usingPublicNetwork(),
  platformVersion: 'V2',
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntimePlatformVersionTest', {
  testCases: [stack],
  regions: ['us-east-1'],
});
