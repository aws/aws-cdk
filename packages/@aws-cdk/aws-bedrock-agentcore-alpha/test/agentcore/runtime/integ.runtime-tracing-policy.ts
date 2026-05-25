/**
 * Integration test for Bedrock AgentCore Runtime tracing resource policy opt-out.
 * This test creates a runtime with tracing enabled but with the X-Ray resource
 * policy creation disabled, for use when a shared policy is managed elsewhere.
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-tracing-policy

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-tracing-policy');

const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
);

// Runtime with tracing enabled but X-Ray resource policy creation disabled.
// This is the opt-out path for accounts where a shared resource policy is
// managed outside this stack (avoids the 20-policy per-region quota).
new agentcore.Runtime(stack, 'TracingPolicyNoneRuntime', {
  runtimeName: 'integ_tracing_policy_none_runtime',
  description: 'Runtime with tracing enabled and resource policy creation disabled',
  agentRuntimeArtifact: runtimeArtifact,
  protocolConfiguration: agentcore.ProtocolType.HTTP,
  tracingEnabled: true,
  tracingResourcePolicy: {
    mode: agentcore.TracingResourcePolicyMode.NONE,
  },
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntimeTracingPolicyTest', {
  testCases: [stack],
});
