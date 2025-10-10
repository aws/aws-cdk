/**
 * Integration test for Bedrock AgentCore Runtime and RuntimeEndpoint constructs
 * This test creates a single runtime with multiple endpoints to test both constructs together
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime

import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../agentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime');

// Use fromAsset to build and push Docker image to ECR automatically
// This uses a minimal test application with no external dependencies
const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
);

// Create a single runtime (similar to the working strands example)
const runtime = new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_test_runtime',
  description: 'Integration test runtime for BedrockAgentCore',
  agentRuntimeArtifact: runtimeArtifact,
  protocolConfiguration: agentcore.ProtocolType.HTTP,
  networkConfiguration: agentcore.RuntimeNetworkConfiguration.usingPublicNetwork(),
  environmentVariables: {
    TEST_ENV: 'integration',
    LOG_LEVEL: 'INFO',
  },
  tags: {
    Environment: 'Integration',
    TestType: 'CDK',
  },
});

// Test RuntimeEndpoint by creating multiple endpoints on the same runtime
// This is more efficient than creating separate runtimes for each endpoint

// Create basic endpoint
const basicEndpoint = new agentcore.RuntimeEndpoint(stack, 'BasicEndpoint', {
  endpointName: 'basic_endpoint',
  agentRuntimeId: runtime.agentRuntimeId,
  agentRuntimeVersion: '1',
  description: 'Basic endpoint for testing',
});

// Create endpoint with tags
const taggedEndpoint = new agentcore.RuntimeEndpoint(stack, 'TaggedEndpoint', {
  endpointName: 'tagged_endpoint',
  agentRuntimeId: runtime.agentRuntimeId,
  agentRuntimeVersion: '1',
  description: 'Endpoint with tags',
  tags: {
    EndpointType: 'Tagged',
    Version: 'v1',
  },
});

// Create version 2 endpoint
const v2Endpoint = new agentcore.RuntimeEndpoint(stack, 'V2Endpoint', {
  endpointName: 'v2_endpoint',
  agentRuntimeId: runtime.agentRuntimeId,
  agentRuntimeVersion: '2',
  description: 'Version 2 endpoint',
});

// Output runtime and endpoint information for verification
new cdk.CfnOutput(stack, 'RuntimeId', {
  value: runtime.agentRuntimeId,
  description: 'Runtime ID',
});

new cdk.CfnOutput(stack, 'RuntimeArn', {
  value: runtime.agentRuntimeArn,
  description: 'Runtime ARN',
});

new cdk.CfnOutput(stack, 'BasicEndpointId', {
  value: basicEndpoint.endpointId,
  description: 'Basic endpoint ID',
});

new cdk.CfnOutput(stack, 'TaggedEndpointId', {
  value: taggedEndpoint.endpointId,
  description: 'Tagged endpoint ID',
});

new cdk.CfnOutput(stack, 'V2EndpointId', {
  value: v2Endpoint.endpointId,
  description: 'Version 2 endpoint ID',
});

// Create the integration test
new integ.IntegTest(app, 'BedrockAgentCoreRuntimeTest', {
  testCases: [stack],
});

app.synth();
