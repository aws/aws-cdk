/**
 * Integration test for Runtime `buildHooks` and `minimumMemory`: deploys a V2 runtime with a warmup
 * hook and a minimum memory, and asserts, via a verifier Lambda, that the deployed runtime reports both.
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-build-hooks

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-build-hooks');

// Container implementing the AgentCore HTTP contract (GET /ping, POST /invocations on :8080) plus
// POST /warmup, so the warmup hook succeeds and the runtime can stabilize.
const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'buildHooksArtifact'),
  { platform: assets.Platform.LINUX_ARM64 },
);

const runtime = new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_build_hooks',
  description: 'Integration test for runtime build hooks and minimum memory',
  agentRuntimeArtifact: runtimeArtifact,
  protocolConfiguration: agentcore.ProtocolType.HTTP,
  networkConfiguration: agentcore.RuntimeNetworkConfiguration.usingPublicNetwork(),
  platformVersion: agentcore.PlatformVersion.V2,
  buildHooks: {
    warmup: agentcore.LifecycleHook.httpPost({ path: '/warmup', port: 8080 }),
  },
  minimumMemory: cdk.Size.gibibytes(4),
});

// Verifier bundles a current SDK so GetAgentRuntime returns hooksConfiguration and
// resourceConfigurations; the integ awsApiCall provider runs the Lambda runtime's older built-in SDK.
const verifier = new NodejsFunction(stack, 'BuildHooksVerifier', {
  entry: path.join(__dirname, 'build-hooks-verifier', 'index.js'),
  runtime: lambda.Runtime.NODEJS_LATEST,
  bundling: { externalModules: [], minify: true },
});
verifier.addToRolePolicy(new iam.PolicyStatement({
  actions: ['bedrock-agentcore:GetAgentRuntime'],
  resources: [runtime.agentRuntimeArn],
}));

const test = new integ.IntegTest(app, 'BedrockAgentCoreRuntimeBuildHooksTest', {
  testCases: [stack],
  regions: ['us-east-2'],
});

// Handler returns "/warmup:8080:4096", so the invoke Payload is the JSON-encoded quoted string.
test.assertions.invokeFunction({
  functionName: verifier.functionName,
  payload: JSON.stringify({ agentRuntimeId: runtime.agentRuntimeId }),
}).expect(integ.ExpectedResult.objectLike({ Payload: '"/warmup:8080:4096"' }));
