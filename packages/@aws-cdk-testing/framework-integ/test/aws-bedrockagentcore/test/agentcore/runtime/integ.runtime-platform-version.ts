/**
 * Integration test for the AgentCore Runtime platform version.
 *
 * Deploy-only: GetAgentRuntime returns platformVersion on the wire, but the SDK
 * bundled with the assertion provider does not model the field yet and drops it
 * while deserializing, so an assertion on it cannot pass. Reaching READY on V2
 * already exercises the snapshot preparation and the container health check.
 * Add the assertion once the SDK models platformVersion.
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-platform-version

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-platform-version');

new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_platform_version',
  description: 'Integration test for platform version V2',
  agentRuntimeArtifact: agentcore.AgentRuntimeArtifact.fromAsset(
    path.join(__dirname, 'testArtifactV2'),
    { platform: assets.Platform.LINUX_ARM64 },
  ),
  platformVersion: agentcore.RuntimePlatformVersion.V2,
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntimePlatformVersionTest', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'eu-west-1', 'ap-northeast-1'], // Platform version V2 is only available in these regions
});
