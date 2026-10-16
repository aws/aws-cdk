/**
 * Integration test for Runtime `platformVersion` V1: deploys a V1 runtime and asserts, via a
 * verifier Lambda, that the deployed runtime reports `platformVersion: V1`.
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-platformversion-v1

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-platformversion-v1');

// Container implementing the AgentCore HTTP contract (GET /ping, POST /invocations on :8080) so the
// runtime can stabilize.
const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'platformVersionV2Artifact'),
  { platform: assets.Platform.LINUX_ARM64 },
);

const runtime = new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_platformversion_v1',
  description: 'Integration test for runtime PlatformVersion V1',
  agentRuntimeArtifact: runtimeArtifact,
  protocolConfiguration: agentcore.ProtocolType.HTTP,
  networkConfiguration: agentcore.RuntimeNetworkConfiguration.usingPublicNetwork(),
  platformVersion: agentcore.PlatformVersion.V1,
});

// Verifier bundles a current SDK so GetAgentRuntime returns platformVersion; the integ awsApiCall
// provider runs the Lambda runtime's older built-in SDK, which strips the field.
const verifier = new NodejsFunction(stack, 'PlatformVersionVerifier', {
  entry: path.join(__dirname, 'platform-version-verifier', 'index.js'),
  runtime: lambda.Runtime.NODEJS_LATEST,
  bundling: { externalModules: [], minify: true }, // bundle the SDK in (one file), not the runtime's built-in
});
verifier.addToRolePolicy(new iam.PolicyStatement({
  actions: ['bedrock-agentcore:GetAgentRuntime'], // IAM prefix differs from the SDK client name
  resources: ['*'],
}));

const test = new integ.IntegTest(app, 'BedrockAgentCoreRuntimePlatformVersionV1Test', {
  testCases: [stack],
  regions: ['us-east-1'],
});

// Handler returns "V1", so the invoke Payload is the JSON-encoded quoted string.
test.assertions.invokeFunction({
  functionName: verifier.functionName,
  payload: JSON.stringify({ agentRuntimeId: runtime.agentRuntimeId }),
}).expect(integ.ExpectedResult.objectLike({ Payload: '"V1"' }));
