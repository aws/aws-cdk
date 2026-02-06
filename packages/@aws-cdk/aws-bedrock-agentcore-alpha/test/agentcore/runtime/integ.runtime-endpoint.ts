/**
 * Integration test for Bedrock AgentCore RuntimeEndpoint construct
 * This test creates a simple endpoint pointing to an existing runtime
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-endpoint

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-endpoint');

// Create a runtime (this simulates an "existing" runtime)
// Using fromAsset to build and push Docker image to ECR automatically
const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
);

const runtime = new agentcore.Runtime(stack, 'ExistingRuntime', {
  runtimeName: 'endpoint_test_runtime',
  description: 'Runtime for endpoint integration test',
  agentRuntimeArtifact: runtimeArtifact,
  protocolConfiguration: agentcore.ProtocolType.HTTP,
  networkConfiguration: agentcore.RuntimeNetworkConfiguration.usingPublicNetwork(),
});

// Create a simple endpoint pointing to the existing runtime
const endpoint = new agentcore.RuntimeEndpoint(stack, 'TestEndpoint', {
  endpointName: 'test_endpoint',
  agentRuntimeId: runtime.agentRuntimeId,
  agentRuntimeVersion: '1', // Point to version 1 of the runtime
  description: 'Simple endpoint for integration testing',
  tags: {
    Purpose: 'IntegrationTest',
    Component: 'RuntimeEndpoint',
  },
});

// Output information for verification
new cdk.CfnOutput(stack, 'RuntimeId', {
  value: runtime.agentRuntimeId,
  description: 'The ID of the runtime',
});

new cdk.CfnOutput(stack, 'RuntimeArn', {
  value: runtime.agentRuntimeArn,
  description: 'The ARN of the runtime',
});

new cdk.CfnOutput(stack, 'EndpointId', {
  value: endpoint.endpointId,
  description: 'The ID of the endpoint',
});

new cdk.CfnOutput(stack, 'EndpointArn', {
  value: endpoint.agentRuntimeEndpointArn,
  description: 'The ARN of the endpoint',
});

new cdk.CfnOutput(stack, 'EndpointName', {
  value: endpoint.endpointName,
  description: 'The name of the endpoint',
});

// Optional: Output versioning information once available
if (endpoint.liveVersion) {
  new cdk.CfnOutput(stack, 'EndpointLiveVersion', {
    value: endpoint.liveVersion,
    description: 'The live version of the endpoint',
  });
}

if (endpoint.targetVersion) {
  new cdk.CfnOutput(stack, 'EndpointTargetVersion', {
    value: endpoint.targetVersion,
    description: 'The target version of the endpoint',
  });
}

// Create the integration test
new integ.IntegTest(app, 'BedrockAgentCoreRuntimeEndpointTest', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'], // Bedrock Agent Core is only available in these regions
});
